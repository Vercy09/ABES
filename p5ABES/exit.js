


class Exit {
    constructor(start, end, isExitFlipped) {
        this.start = start;
        this.end = end;
        this.position = createVector((start.x+end.x)/2, (start.y+end.y)/2);
        
        //vertical exit - exit towards left
        if (start.x == end.x && !isExitFlipped) 
        {
            this.checkExit = function(agent) {     
                if(agent.position.x < this.start.x && agent.position.y > this.start.y && agent.position.y < this.end.y){
                    //console.log("exit towards left");
                    return agent.position.x > this.start.x - 20; //limit to some range so that other things in the path are not effected
                } 
                
                return false;
            }
        }

        //vertical exit - exit towards right
        if (start.x == end.x && isExitFlipped) 
        {
            this.checkExit = function(agent) {
                if(agent.position.x > this.start.x && agent.position.y > this.start.y && agent.position.y < this.end.y){
                    //console.log("exit towards right");
                    return agent.position.x < this.start.x + 20; //limit to some range so that other things in the path are not effected
                }
                return false;
            }
        }

        //horizontal exit - exit towards down
        if (start.y == end.y && !isExitFlipped) 
        {
            this.checkExit = function(agent) {
                if(agent.position.y > this.start.y && agent.position.x > this.start.x && agent.position.x < this.end.x){
                    //console.log("exit towards bottom");
                    return agent.position.y < this.start.y + 20; //limit to some range so that other things in the path are not effected
                }
                return false;
            }
        }

        //horizontal exit - exit towards top
        if (start.y == end.y && isExitFlipped) 
        {
            this.checkExit = function(agent) {
                if(agent.position.y < this.start.y && agent.position.x > this.start.x && agent.position.x < this.end.x){
                    //console.log("exit towards top");
                    return agent.position.y > this.start.y - 20; //limit to some range so that other things in the path are not effected
                }
                return false;
            }
        }

    }

    

    show() {
        stroke(0,100,255,100);
	    strokeWeight(6);
        line(this.start.x, this.start.y, this.end.x, this.end.y);
    }


   

    getLength() {
        return p5.Vector.sub(this.end,this.start).mag(0);
    }
}