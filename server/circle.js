class Circle {
    constructor(position, velocity, radius, mass) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.mass = 10
    }
    bounceCircle(circle) {
        let dVec = this.position.copy.sub(circle.position)
        let d = dVec.mag
        let dCollide = this.radius + circle.radius
        let cross = d - ddCollide
        if (cross < 0) {
            let crossRatio = cross / d
            let tMass = this.mass + circle.mass
            let acc = dVec.mul(crossRatio * this.mass / (tMass))
            // might need to flip this. 
            this.velocity.add(acc)
            circle.velocity.sub(acc)
        }
    }
}

module.exports = Circle