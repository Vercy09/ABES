let agents = []
let paths = [];
let points = [];
let walls = [];
let obstacles = []
let exits = [];
let startx;
let starty
let offset;
let debug = false;
let detailedDebug = false;
let centerCircle;
let numAgents = 500;
let addExtraExit = true;
let addedExtraObstacles = false;
let example = 2;

// bin-lattice spatial subdivision
let grid;
let cols;
let rows;
let resolution = 40; // adjust as necessary

function make2DArray(cols, rows) {
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}



function setup1() {
	centerCircle = createVector(width / 2, height / 2 - 64);
	offset = 200;
	startx = 350;
	starty = 80;
	points.push(createVector(startx, starty));
	points.push(createVector(startx, starty + offset));
	points.push(createVector(startx - offset * 1.4, starty + offset));
	points.push(createVector(startx - offset * 1.4, starty + offset * 2));
	//points.push(createVector(startx - offset * 1.4, starty + offset + offset/2 + 10));
	points.push(createVector(startx, starty + offset * 2));
	points.push(createVector(startx, starty + offset * 3));
	points.push(createVector(width / 2 - 128, starty + offset * 3));
	points.push(createVector(width / 2 - 128, starty + offset * 4));
	points.push(createVector(width / 2 + 128, starty + offset * 4));
	points.push(createVector(width / 2 + 128, starty + offset * 3));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx), starty + offset * 3));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx), starty + offset * 2));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx) + offset * 1.4, starty + offset * 2));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx) + offset * 1.4, starty + offset));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx), starty + offset));
	points.push(createVector(width / 2 + 128 + (width / 2 - 128 - startx), starty));
	for (let i = 0; i < points.length; i++) {
		walls.push(new Wall(points[i], points[(i + 1) % points.length]));
	}

	paths.push(new Path(80));
	paths.push(new Path(80));
	paths.push(new Path(110));




	paths[0].addPoint(startx + 50, (starty + offset * 2 - offset / 2));
	paths[0].addPoint(startx - offset * 1.4 - 50, (starty + offset * 2 - offset / 2));

	paths[1].addPoint(width / 2 + 128 + (width / 2 - 128 - startx) - 50, (starty + offset * 2 - offset / 2));
	paths[1].addPoint(width / 2 + 128 + (width / 2 - 128 - startx) + offset * 1.4 + 50, (starty + offset * 2 - offset / 2));

	paths[2].addPoint(width / 2, starty + offset * 3 - 30);
	paths[2].addPoint(width / 2, starty + offset * 4 + 30);

	

	exits.push(createExitVertical(2, walls[2].getLength() / 2, 30));
	exits.push(createExitVertical(11, walls[11].getLength() / 2, 30));
	exits.push(createExitHorizontal(6, walls[6].getLength() / 2, 60));
	
	if(addExtraExit)
	exits.push(createExitHorizontal(12, walls[12].getLength()/2, 80));
	console.log(exits);


	let minx = startx + 10;
	let maxx = width / 2 + 128 + (width / 2 - 128 - startx) - 10;
	let miny = starty + 10;
	let maxy = starty + offset * 3 - 10;
	for (let i = 0; i < numAgents; i++) {
		let agent = new Agent(getRandomStartPos(minx, maxx, miny, maxy), createVector(mouseX, mouseY), color(100, 100, 100));
		agent.r = 9.0;
		let exit = getClosestExit(agent)
		agent.setTarget(exit.position);
		
		if(exit !== exits[3])
		agent.setPath(getClosestPath(exit.position));
		//agent.setPath(null);
		agents.push(agent);
	}


	obstacles.push(new Obstacle(centerCircle, 100));
	
	
}

function setup2() {

	offset = 200;
	startx = 100;
	starty = 100;
	points.push(createVector(startx, starty));
	points.push(createVector(startx, starty + offset));
	points.push(createVector(startx + offset / 3, starty + offset));
	points.push(createVector(startx + offset / 3, starty + offset * 2));
	points.push(createVector(startx, starty + offset * 2));
	points.push(createVector(startx, starty + offset * 3));
	points.push(createVector(startx + offset * 2, starty + offset * 3));
	points.push(createVector(startx + offset * 2, starty + offset * 3 - offset / 3));
	points.push(createVector(startx + offset * 3, starty + offset * 3 - offset / 3));
	points.push(createVector(startx + offset * 3, starty + offset * 3));
	points.push(createVector(startx + offset * 3 + offset / 2, starty + offset * 3));
	points.push(createVector(startx + offset * 3 + offset / 2, starty + offset * 2));
	points.push(createVector(startx + offset * 3, starty + offset * 2));
	points.push(createVector(startx + offset * 3, starty + offset * 2 + offset / 3));
	points.push(createVector(startx + offset * 2, starty + offset * 2 + offset / 3));
	points.push(createVector(startx + offset * 2, starty + offset * 2 + offset / 3));
	points.push(createVector(startx + offset * 2, starty + offset * 2));
	points.push(createVector(startx + offset - offset / 3, starty + offset * 2));
	points.push(createVector(startx + offset - offset / 3, starty + offset));
	points.push(createVector(startx + offset * 2, starty + offset));
	points.push(createVector(startx + offset * 2, starty + offset - offset / 3));
	points.push(createVector(startx + offset * 5, starty + offset - offset / 3));
	points.push(createVector(startx + offset * 5, starty + offset * 3));
	points.push(createVector(startx + offset * 7, starty + offset * 3));
	points.push(createVector(startx + offset * 7, starty + offset * 3 - offset / 1.5));
	points.push(createVector(startx + offset * 6 - offset / 3, starty + offset * 3 - offset / 1.5));
	points.push(createVector(startx + offset * 6 - offset / 3, starty + offset - offset / 3));
	points.push(createVector(startx + offset * 7, starty + offset - offset / 3));
	points.push(createVector(startx + offset * 7, starty));
	points.push(createVector(startx + offset * 5, starty));
	points.push(createVector(startx + offset * 5, starty + offset / 3));
	points.push(createVector(startx + offset * 2, starty + offset / 3));
	points.push(createVector(startx + offset * 2, starty));
	points.push(createVector(startx, starty));


	for (let i = 0; i < points.length - 1; i++) {
		walls.push(new Wall(points[i], points[(i + 1)]));
	}


	let path = new Path(offset / 4);
	path.addPoint(walls[22].end.x - offset / 4, walls[22].start.y - (offset / 3));
	path.addPoint(walls[22].start.x+offset/2, walls[22].start.y - (offset / 3));
	paths.push(path);


	path = new Path(offset / 4);
	path.addPoint(walls[22].start.x+offset/3, walls[22].start.y - offset);
	path.addPoint(walls[22].start.x+offset/3, walls[22].start.y - offset*2-offset/3);
	paths.push(path);
	
	path = new Path(offset / 8);
	path.addPoint(walls[20].start.x + walls[20].getLength(), starty + offset / 2);
	path.addPoint(walls[20].start.x, starty + offset / 2);
	paths.push(path);

	path = new Path(offset / 8);
	path.addPoint(walls[2].start.x + (offset / 3) / 2, walls[2].start.y - offset/2);
	path.addPoint(walls[2].start.x + (offset / 3) / 2, walls[2].end.y + offset/8);
	paths.push(path);

	path = new Path(offset / 8);
	path.addPoint(walls[7].start.x-offset/4, walls[7].start.y - (offset / 3) / 2);
	path.addPoint(walls[7].end.x+offset/1.5, walls[7].start.y - (offset / 3) / 2);
	paths.push(path);

	


	exits.push(createExitVertical(10, walls[10].getLength() / 2, 50));
}


function draw1() {
	background(255);

	// Reset grid at the beginning of each frame
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = [];
		}
	}

	// Place each agent into the appropriate cell in the grid
	for (let agent of agents) {
		let col = floor(agent.position.x / resolution);
		let row = floor(agent.position.y / resolution);
		col = constrain(col, 0, cols - 1);
		row = constrain(row, 0, rows - 1);
		grid[col][row].push(agent);
	}

	// Draw the grid
	stroke(200);
	strokeWeight(1);

	// Draw vertical lines
	for (let i = 0; i <= cols; i++) {
		let x = i * resolution;
		line(x, 0, x, height);
	}

	// Draw horizontal lines
	for (let j = 0; j <= rows; j++) {
		let y = j * resolution;
		line(0, y, width, y);
	}


	if (debug)
		for (let path of paths) path.show();
	stroke(100);
	strokeWeight(4);
	noFill();


	for (let obstacle of obstacles) {
		obstacle.show();
	}




	for (let agent of agents) {

		if (agent.evacuated) continue;
		//agent.setTarget(createVector(mouseX, mouseY));

		for (let exit of exits) {
			if (exit.checkExit(agent)) agent.evacuated = true;
		}


		agent.update(agents, obstacles);
		agent.show();
	}

	for (let wall of walls) {
		wall.show();
		for (let agent of agents) {
			if(agent.evacuated) continue;
			if (coll_det_bw(agent, wall)) {
				//console.log("collision");
				pen_res_bw(agent, wall);
				coll_res_bw(agent, wall);
			}
		}
	}
	if (debug)
		for (let exit1 of exits) {
			exit1.show();
		}

	stroke(255, 0, 0);
	strokeWeight(8);
	//line(70, 370, 70, 390);
}


function draw2() {
	background(255);

	// Reset grid at the beginning of each frame
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = [];
		}
	}

	// Place each agent into the appropriate cell in the grid
	for (let agent of agents) {
		let col = floor(agent.position.x / resolution);
		let row = floor(agent.position.y / resolution);
		col = constrain(col, 0, cols - 1);
		row = constrain(row, 0, rows - 1);
		grid[col][row].push(agent);
	}

	// Draw the grid
	stroke(200);
	strokeWeight(1);

	// Draw vertical lines
	for (let i = 0; i <= cols; i++) {
		let x = i * resolution;
		line(x, 0, x, height);
	}

	// Draw horizontal lines
	for (let j = 0; j <= rows; j++) {
		let y = j * resolution;
		line(0, y, width, y);
	}


	if (debug)
		for (let path of paths) path.show();
	stroke(100);
	strokeWeight(4);
	noFill();


	for (let obstacle of obstacles) {
		obstacle.show();
	}




	for (let agent of agents) {

		if (agent.evacuated) continue;
		//agent.setTarget(createVector(mouseX, mouseY));

		for (let exit of exits) {
			if (exit.checkExit(agent)) agent.evacuated = true;
		}

		if(agent.offPath) {
			let path = getNextPath(agent.path);
			if(path) agent.setPath(path);
			else agent.setTarget(exits[0].position);
			
		}
		
		agent.update(agents, obstacles);
		agent.show();
	}

	for (let wall of walls) {
		wall.show();
		for (let agent of agents) {
			if (coll_det_bw(agent, wall)) {
				//console.log("collision");
				pen_res_bw(agent, wall);
				coll_res_bw(agent, wall);
			}
		}
	}
	if (debug)
		for (let exit1 of exits) {
			exit1.show();
		}

	stroke(255, 0, 0);
	strokeWeight(8);
	//line(70, 370, 70, 390);
}


function setup() {
	createCanvas(windowWidth, windowHeight);
	cols = floor(width / resolution);
	rows = floor(height / resolution);
	grid = make2DArray(cols, rows);
	if(example === 1) setup1();
	else setup2();
	
	
}



function draw() {
	if(example === 1) draw1();
	else draw2();
}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}



function getClosestPath(position) {

	let minD = p5.Vector.dist(position, paths[0].points[0]);
	let closest = paths[0];
	for (let i = 0; i < paths.length; i++) {
		//console.log(paths[i].points);
		let d = p5.Vector.dist(position, paths[i].points[0]);
		if (d < minD) {
			minD = d;
			closest = paths[i];
		}
	}
	return closest;
}

function getNextPath(currPath) {
	let i;
	for (i = 0; i < paths.length; i++) {

		if(paths[i] == currPath) break;
	}
	return paths[i+1];
	
}

function getClosestExit(agent) {

	let minD = p5.Vector.dist(agent.position, exits[0].position);
	let closest = exits[0];
	for (let i = 0; i < exits.length; i++) {
		//console.log(paths[i].points);
		let d = p5.Vector.dist(agent.position, exits[i].position);
		if (d < minD) {
			minD = d;
			closest = exits[i];
		}
	}
	return closest;
}


function getRandomIntInRange(x1, x2) {
	// Ensure x1 and x2 are integers
	x1 = Math.floor(x1);
	x2 = Math.floor(x2);

	// Swap values if x2 is smaller than x1
	if (x2 < x1) {
		let temp = x1;
		x1 = x2;
		x2 = temp;
	}

	// Calculate the random integer within the range
	return Math.floor(Math.random() * (x2 - x1 + 1)) + x1;
}


function getRandomStartPos(xmin, xmax, ymin, ymax) {
	let res = createVector(getRandomIntInRange(xmin, xmax), getRandomIntInRange(ymin, ymax));
	while (p5.Vector.dist(res, centerCircle) < 6 + 100) res = createVector(getRandomIntInRange(xmin, xmax), getRandomIntInRange(ymin, ymax));
	return res;
}


//returns with closest point on a line segment to a given point
function closestPointBW(b1, w1) {
	let ballToWallStart = p5.Vector.sub(w1.start, b1.position);
	if (p5.Vector.dot(w1.wallUnit(), ballToWallStart) > 0) {
		return w1.start;
	}

	let wallEndToBall = p5.Vector.sub(b1.position, w1.end);
	if (p5.Vector.dot(w1.wallUnit(), wallEndToBall) > 0) {
		return w1.end;
	}

	let closestDist = p5.Vector.dot(w1.wallUnit(), ballToWallStart);
	let closestVect = w1.wallUnit().mult(closestDist);
	return p5.Vector.sub(w1.start, closestVect);
}

//collision detection between ball and wall
function coll_det_bw(b1, w1) {
	let ballToClosest = p5.Vector.sub(closestPointBW(b1, w1), b1.position);
	if (ballToClosest.mag() <= b1.r) {
		return true;
	}
}



//penetration resolution between ball and wall
function pen_res_bw(b1, w1) {
	let penVect = p5.Vector.sub(b1.position, closestPointBW(b1, w1));
	let penVectMag = penVect.mag();
	b1.position.add(penVect.setMag(1).mult(b1.r - penVectMag));
}

//collision response between ball and wall
function coll_res_bw(b1, w1) {
	let normal = p5.Vector.sub(b1.position, closestPointBW(b1, w1)).setMag(1);
	let sepVel = p5.Vector.dot(b1.velocity, normal);
	let new_sepVel = -sepVel * 0.5;
	let vsep_diff = sepVel - new_sepVel;
	b1.velocity.add(normal.mult(-vsep_diff));
}


function mouseClicked() {
	//points.push(createVector(mouseX, mouseY));
	//console.log(points.length);
	console.log(mouseX + "," + mouseY);
	//debug = !debug;

	if(example === 1) {
		for (let i = 0; i < 10; i++) {
			let rng = Math.floor(Math.random() * 15) + 1
			let agent = new Agent(createVector(mouseX+rng, mouseY+rng), createVector(mouseX, mouseY), color(100, 100, 100));
			agent.r = 9.0;
			let exit = getClosestExit(agent)
			agent.setTarget(exit.position);
			
			if(exit !== exits[3])
			agent.setPath(getClosestPath(exit.position));
			//agent.setPath(null);
			agents.push(agent);
		}
		if(mouseButton === RIGHT) {
			console.log("right click");
		}
	}
	else {
		for(let i = 0; i < 10; i++) {
			let rng = Math.floor(Math.random() * 15) + 1
			let agent = new Agent(createVector(mouseX+rng, mouseY+rng), null, color(100, 100, 100));
			
				agent.setPath(getClosestPath(agent.position));
				
				agents.push(agent);
			}
	}
		
}

function keyPressed() {
	console.log(keyCode);
	if (key == 'd') {
		debug = !debug;
	}
	if (key == 'v') {
		detailedDebug = !detailedDebug;
		//debug = detailedDebug;
	}
	if (key == 'o') {
		if(addedExtraObstacles) return
		else {
			obstacles.push(new Obstacle(createVector(startx+offset, 200), 50));
			obstacles.push(new Obstacle(createVector(startx+offset, 400), 50));
			obstacles.push(new Obstacle(createVector(startx+offset, 600), 50));
			addedExtraObstacles = true;
		}
	}
}


function createExitVertical(wallId, startOffset, size) {
	let wall = walls.splice(wallId, 1)[0];
	let isExitFlipped = false;

	if (wall.start.y > wall.end.y) {
		let wallStart = createVector(wall.start.x, wall.start.y);
		wall.start = wall.end;
		wall.end = wallStart;
		isExitFlipped = true;
	}


	let newWall1 = new Wall(wall.start, createVector(wall.start.x, wall.start.y + startOffset - size / 2));
	walls.push(newWall1);

	let newWall2 = new Wall(createVector(newWall1.end.x, newWall1.end.y + size), wall.end);
	walls.push(newWall2);

	let exit = new Exit(newWall1.end, newWall2.start, isExitFlipped);
	//exit.setPath(getClosestPath(exit.position))
	return exit;
}


function createExitHorizontal(wallId, startOffset, size) {
	let wall = walls.splice(wallId, 1)[0];
	let isExitFlipped = false;


	if (wall.start.x > wall.end.y) {
		let wallStart = createVector(wall.start.x, wall.start.y);
		wall.start = wall.end;
		wall.end = wallStart;
		isExitFlipped = true;
	}


	let newWall1 = new Wall(wall.start, createVector(wall.start.x + startOffset - size / 2, wall.start.y));
	walls.push(newWall1);

	let newWall2 = new Wall(createVector(newWall1.end.x + size, newWall1.end.y), wall.end);
	walls.push(newWall2);

	let exit = new Exit(newWall1.end, newWall2.start, isExitFlipped);
	//exit.setPath(getClosestPath(exit.position))
	return exit;
}