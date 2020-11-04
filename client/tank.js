
class Tank {
    constructor(x,y,r){
        this.position = createVector(x,y)
        this.radius = r        

    }
    display(){
        fill(200,130,130)
        ellipse(x,y,r*2,r*2)
    }

    handleKeys(e){
        console.log(e.key)
    }
    

}
