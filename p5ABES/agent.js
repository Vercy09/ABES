const AGENT_ACTIONS = {
    IDLE: 0,
    SEEK: 1
};



class Agent {

    constructor(position, target, color) {
        this.position = createVector(position.x, position.y);
        this.velocity = createVector(0.0, 0.0);
        this.acceleration = createVector(0.0, 0.0);
        this.r = 11.0;
        this.maxSpeed = 1;
        this.maxForce = 0.2;
        this.target = target;
        this.color = color;
        this.seg1 = -1;
        this.seg2 = -1;
        this.offPath = false;
        this.path = null;
        this.evacuated = false;
    }


    setTarget(target) {
        this.target = target;
    }

    setPath(path) {
        this.path = path;
        this.offPath = false;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }


    seek(target) {
        // Calculate the desired velocity to target at max speed.
        let desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxSpeed);

        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }


    arrive(target) {
        // Calculate the desired velocity to target at max speed.
        let desired = p5.Vector.sub(target, this.position);

        let d = desired.mag();
        // Scale with arbitrary damping within 100 pixels
        if (d < 100) {
            let m = map(d, 0, 100, 0, this.maxSpeed);
            desired.setMag(m);
        } else {
            desired.setMag(this.maxSpeed);
        }


        let steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxForce);
        return steer;
    }

    separate(agents) {
        let desiredSeparation = this.r * 2;
        let sum = createVector();
        let count = 0;
        for (let other of agents) {
            if (this === other || other.evacuated) continue;

            let distance = p5.Vector.dist(this.position, other.position);
            if (distance >= desiredSeparation) continue;

            let away = p5.Vector.sub(this.position, other.position); // vector pointing away from the "other" agent
            away.setMag(1 / distance);
            sum.add(away);
            count++;
        }

        if (count > 0) {
            sum.div(count);
            sum.setMag(this.maxSpeed);
            sum.sub(this.velocity);
            sum.limit(this.maxForce);
        }
        return sum;
    }


    avoidObstacle(obstacles) {
        let steerAngle = 0.0;
        for (let i = 0; i < obstacles.length; i++) {
            let obstacle = obstacles[i];
            //find if boid is near the obstacle
            let vec = p5.Vector.sub(obstacle.center, this.position);	//vector joining the centers

            let distBetweenCenters = vec.mag();
            if (distBetweenCenters < 2 * obstacle.r) {
                let dotProduct = p5.Vector.dot(vec, this.velocity);
                //find if boid is movind towards the obstacle
                if (dotProduct > 0.0) {
                    //angle tangent from boid makes with the line joining the center
                    //of the obstable

                    let tangentAngle = asin(limitToDomain((obstacle.r + this.r + 2.0) / distBetweenCenters));
                    //angle between direction of boid and line joining the center
                    let directionAngle = acos(limitToDomain(dotProduct / (vec.mag() * this.velocity.mag())));

                    if (directionAngle < tangentAngle) {
                        let desired = p5.Vector.sub(this.target, this.position);
                        
                        //console.log(desired.angleBetween(toObstacle));
                        if (desired.angleBetween(vec) > 0)
                            steerAngle -= (tangentAngle - directionAngle);
                        else
                            steerAngle += (tangentAngle - directionAngle);
                    }


                    //console.log(directionAngle);
                    //stroke(100);
                    //strokeWeight(4);


                    //line(this.position.x, this.position.y, this.target.x, this.target.y);
                    //line(this.position.x, this.position.y, obstacle.center.x, obstacle.center.y);

                }
            }
        }

        //console.log(this.velocity.angle()-steerAngle);
        //console.log(adjustAngle(degrees(steerAngle)));
        //console.log(adjustAngle(degrees(-steerAngle)));
        return steerAngle;
    }

    follow(path) {
        //if(this.offPath) return createVector(0.0,0.0);
        // Predict position 25 (arbitrary choice) frames ahead
        let predict = this.velocity.copy();
        predict.normalize();
        predict.mult(25);
        let predictpos = p5.Vector.add(this.position, predict);

        // Now we must find the normal to the path from the predicted position
        // We look at the normal for each line segment and pick out the closest one
        let normal = null;
        let target = null;
        let worldRecord = 1000000; // Start with a very high worldRecord distance that can easily be beaten

        let seg1 = -1;
        let seg2 = -1;

        // Loop through all points of the path
        for (let i = 0; i < path.points.length; i++) {

            // Look at a line segment
            let a = path.points[i];
            let b = path.points[(i + 1) % path.points.length]; // Note Path has to wraparound

            // Get the normal point to that line
            let normalPoint = getNormalPoint(predictpos, a, b);
            if (p5.Vector.dist(path.points[path.points.length - 1], normalPoint) < 10) {
                //console.log("end of path");
                this.offPath = true;
                return createVector(0.0, 0.0);
            }




            // Check if normal is on line segment
            let dir = p5.Vector.sub(b, a);
            // If it's not within the line segment, consider the normal to just be the end of the line segment (point b)
            
            
            if (normalPoint.x < min(a.x, b.x) || normalPoint.x > max(a.x, b.x) || normalPoint.y < min(a.y, b.y) || normalPoint.y > max(a.y, b.y)) {
                normalPoint = b.copy();
                // If we're at the end we really want the next line segment for looking ahead
                a = path.points[(i + 1) % path.points.length];
                b = path.points[(i + 2) % path.points.length]; // Path wraps around
                dir = p5.Vector.sub(b, a);
                //if (da + db > dir.mag()+1) {console.log("aaa");}
                //if(i == path.points.length-1)
                // console.log("off path");
            }

            // How far away are we from the path?
            let d = p5.Vector.dist(predictpos, normalPoint);
            // Did we beat the worldRecord and find the closest line segment?
            if (d < worldRecord) {
                seg1 = i;
                seg2 = (i + 1) % path.points.length;

                worldRecord = d;
                normal = normalPoint;

                // Look at the direction of the line segment so we can seek a little bit ahead of the normal
                dir.normalize();
                // This is an oversimplification
                // Should be based on distance to path & velocity
                dir.mult(25);
                target = normal.copy();
                target.add(dir);
            }
        }
        if (seg1 != this.seg1) {
            this.seg1 = seg1;
            this.seg2 = seg2;

            //console.log("Line seg: " + seg1 + "," + seg2);
        }



        // Draw the debugging stuff
        if (detailedDebug) {
            // Draw predicted future position
            stroke(0);
            fill(0);
            line(this.position.x, this.position.y, predictpos.x, predictpos.y);
            ellipse(predictpos.x, predictpos.y, 4, 4);

            // Draw normal position
            stroke(0);
            fill(0);
            ellipse(normal.x, normal.y, 4, 4);
            // Draw actual target (red if steering towards it)
            line(predictpos.x, predictpos.y, target.x, target.y);
            if (worldRecord > path.radius) fill(255, 0, 0);
            noStroke();
            ellipse(target.x, target.y, 8, 8);
        }

        // Only if the distance is greater than the path's radius do we bother to steer
        if (worldRecord > path.radius) {
            return this.seek(target);
        } else {
            return this.seek(target).mult(0.3);
            //return createVector(0.0, 0.0);
            

            //
            return this.seek(path.points[seg2]).mult(0.5);
        }
    }

    neighbors() {
        let col = Math.floor(this.position.x / resolution);
        let row = Math.floor(this.position.y / resolution);
        let neighbors = [];

        // Check cells in a 3x3 block around the current boid
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                let newCol = col + i;
                let newRow = row + j;
                // Make sure this is a valid cell
                if (newCol >= 0 && newCol < cols && newRow >= 0 && newRow < rows) {
                    // Add all boids in this cell to neighbors
                    neighbors = neighbors.concat(grid[newCol][newRow]);
                }
            }
        }
        return neighbors;
    }

    update(agents, obstacles) {

        let force = createVector(0, 0);
        if(this.target)
        force.add(this.seek(this.target));

        if (this.path) force.add(this.follow(this.path).mult(2));






        //console.log(this.neighbors());

        force.add(this.separate(this.neighbors()).mult(4));
        //force.add(this.separate(agents).mult(3));


        this.applyForce(force);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.velocity.rotate(this.avoidObstacle(obstacles));
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    show() {
        stroke(255);
        strokeWeight(1);

        fill(this.color);
        push();
        circle(this.position.x, this.position.y, this.r * 2);
        fill(127);
        stroke(0);
        strokeWeight(2);
        //line(0, 0, this.radius, 0);


        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());

        if (detailedDebug) 
            triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
        pop();
    }
}

// A function to get the normal point from a point (p) to a line segment (a-b)
function getNormalPoint(p, a, b) {
    // Vector from a to p
    let ap = p5.Vector.sub(p, a);
    // Vector from a to b
    let ab = p5.Vector.sub(b, a);
    ab.normalize(); // Normalize the line
    // Project vector "diff" onto line by using the dot product
    ab.mult(ap.dot(ab));
    let normalPoint = p5.Vector.add(a, ab);
    return normalPoint;
}


function limitToDomain(input) {
    if (input < -1) {
        return -1;
    } else if (input > 1) {
        return 1;
    } else {
        return input;
    }
}


function adjustAngle(angle) {
    // Use the modulo operator to wrap the angle within the range [0, 360)
    return (angle % 360 + 360) % 360;
}