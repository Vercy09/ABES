class Wall {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }

    show() {
        stroke(100);
	    strokeWeight(4);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }


    wallUnit(){
        return p5.Vector.sub(this.end,this.start).setMag(1);
    }

    getLength() {
        return p5.Vector.sub(this.end,this.start).mag(0);
    }
}