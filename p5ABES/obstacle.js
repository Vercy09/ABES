class Obstacle {
    constructor(center, radius) {
        this.center = center;
        this.r = radius;
    }

    show() {
        stroke(100);
	    strokeWeight(4);
	    noFill();
        circle(this.center.x, this.center.y, this.r*2);
    }
}