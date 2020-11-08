const CONFIG = require("../Config")
const {Vec} = require("./vectors")
const MOVE_SPEED = 1
const ROTATION_SPEED = 2


function bounceCircle(circle,circle2) {
    let dVec = circle2.position.copy.sub(circle.position)
    let d = dVec.mag
    let dCollide = circle2.radius + circle.radius
    let cross = d - ddCollide
    if (cross < 0) {
        let crossRatio = cross / d
        let tMass = circle2.mass + circle.mass
        let acc = dVec.copy.mul(crossRatio * circle2.mass / (tMass))
        // might need to flip these. 
        circle2.velocity.add(acc)
        circle.velocity.sub(acc)
    }
}

const generateColor = () => [0,0,0].map(() => Math.floor(Math.random() * 256))

class Player {
    constructor(socket,name) {
        this.socket = socket
        this.name = name
        this.rotation = 0
        this.rotateBy = 0
        this.color = generateColor()
        this.mass = CONFIG.GAME.PLAYER_M
        this.position = new Vec(0,0)
        this.velocity = new Vec(0,0)
        this.radius = CONFIG.GAME.PLAYER_R
        this.listenKeys()
    }
    
    update(delta) {
        this.position.add(this.velocity.copy.mul(delta))
        this.rotation = (this.rotation + (this.rotateBy * delta)) % (Math.PI * 2)
    }

    listenKeys() {
        this.socket.on(CONFIG.SOCKET.SEND_KEYS, (keys) => {
            let [vx, vy, vr] = keys
            vx = Math.sign(vx) * MOVE_SPEED
            vy = Math.sign(vy) * MOVE_SPEED
            vr = Math.sign(vr) * ROTATION_SPEED
            this.velocity = new Vec(vx, vy)
            this.rotateBy = vr
        })
    }

    serialize() {
        const [r,g,b] = this.color
        return {                
            x : this.position.x,
            y : this.position.y,
            r : this.rotation,
            color : {r,g,b}  ,
            name : this.name
        }
    }
}

class Game {
    constructor(roomId, io, players) {
        this.roomId = roomId
        this.players = players || []
        this.bullets = []
        this.walls = []
        this.fps = CONFIG.GAME.FPS
        this.sleep = 1000 / this.fps
        this.precision = 10
        this.timeoutID = null
        this.last = null
        this.io = io
    }
    addPlayer(p) {
        this.players.push(p)
    }
    emit() {
        const gameData = this.serialize()
        this.io.to(this.roomId).emit(CONFIG.SOCKET.RECEIVE, gameData)
    }
    update(delta) {
        for (let p of this.players) p.update(delta)
        for (let b of this.bullets) b.update(delta)

    }

    serialize() {
        return {
            players: this.players.map(player => player.serialize()),
            bullets: this.bullets.map(bullet => bullet.serialize()),
        }
    }
    loop = () => {
        let now = Date.now()
        let delta = now - this.last
        this.last = now
        for (let i = 0; i < this.precision; i++) this.update(delta / this.precision)
        this.emit()
        this.timeoutID = setTimeout(this.loop, this.sleep)
    }
    start() {
        this.last = Date.now()
        this.timeoutID = setTimeout(this.loop, this.sleep)
    }
    stop() {
        clearTimeout(this.timeoutID)
    }
}

module.exports = {
    Game,
    Player
}