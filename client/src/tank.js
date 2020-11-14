
class Tank {
    constructor(x,y,r){
        this.position = createVector(x,y)
        this.radius = r        

    }
    display(){
        fill(200,130,130)
        ellipse(this.position.x,this.position.y,this.radius*2,this.radius*2)
    }

    handleKeys(e){
        // console.log(e.key)
    }
    

}
