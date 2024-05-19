class Path {
    constructor(r) {
      // How far is it ok for the agent to wander off
        this.radius = r;
        this.points = [];
    }
  
    addPoint(x, y) {
        let point = createVector(x, y);
        this.points.push(point);
    }
  
    getStart() {
        return this.points[0];
    }
  
    getEnd() {
        return this.points[this.points.length - 1];
    }
  
  
    show() {
        strokeJoin(ROUND);
        // Draw thick line for radius
        stroke(200);
        strokeWeight(this.radius * 2);
        noFill();
        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape();
        // Draw thin line for center of path
        stroke(0);
        strokeWeight(1);
        noFill();
        beginShape();
        for (let i = 0; i < this.points.length; i++) {
            vertex(this.points[i].x, this.points[i].y);
        }
        endShape();
    }
  }