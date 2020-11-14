const CONFIG = require("../Config")
const { Vec } = require("./vectors")
const MOVE_SPEED = 0.03
const ROTATION_SPEED = 0.005


function bounceCircle(circle, circle2) {
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

const generateColor = () => [0, 0, 0].map(() => Math.floor(Math.random() * 256))

class Bullet {
    constructor(x, y, dir, speed, color, playerRadius) {
        this.position = new Vec(x, y)
        this.velocity = new Vec(speed, 0).setDir(dir)
        this.alive = true
        this.color = color
        this.radius = CONFIG.GAME.BULLET_R
        this.position.add(this.velocity.copy.muln((playerRadius  + this.radius)/ speed))
    }
    applyFriction() {
        this.velocity.muln(CONFIG.GAME.BULLET_FRICTION_COEFF)
    }

    update(delta) {
        if (this.velocity.mag < CONFIG.GAME.BULLET_SPEED_THRESHOLD) {
            this.alive = false
        }
        this.applyFriction()
        this.position.add(this.velocity.copy.muln(delta))
    }

    serialize() {
        const { x, y } = this.position
        const [r, g, b] = this.color
        return {
            x, y,
            color: { r, g, b }
        }
    }

    
    static colliding(bullet1, bullet2) {
        const distance = bullet1.position.copy.sub(bullet2.position).mag 
        const totalRadii = bullet1.radius + bullet2.radius
        // console.log(distance,totalRadii)
        if (distance < totalRadii ) {
            return true
        }
        return false
    }
}

class Player {
    constructor(socket, name, game) {
        this.health =
            this.socket = socket
        this.name = name
        this.rotation = 0
        this.rotateBy = 0
        this.color = generateColor()
        this.mass = CONFIG.GAME.PLAYER_M
        this.position = new Vec(0, 0)
        this.velocity = new Vec(0, 0)
        this.acceleration = new Vec(0, 0)
        this.radius = CONFIG.GAME.PLAYER_R
        this.maxVelocity = CONFIG.GAME.MAX_VELOCITY
        this.maxAcceleration = CONFIG.GAME.MAX_ACCELERATION
        this.frictionCoeff = CONFIG.GAME.FRICTION_COEFF
        this.game = game
        this.shootingSpeed = CONFIG.GAME.INIT_SHOOTING_SPEED
        this.initialBulletTick = 0
        this.listenKeys()
    }

    applyFriction() {
        if (this.velocity.mag !== 0) {
            this.velocity.mag = this.velocity.mag * this.frictionCoeff
        }
    }

    update(delta, ticks) {
        if (isNaN(this.position.x) || isNaN(this.position.y)) {
            // console.log("its null!")
        }
        this.velocity.add(this.acceleration)
        this.applyFriction()
        this.velocity.limit(this.maxVelocity)
        this.position.add(this.velocity.copy.muln(delta))
        this.rotation = (this.rotation + (this.rotateBy * delta)) % (Math.PI * 2)
        if (this.shooting) {
            if (ticks % this.shootingSpeed === this.initialBulletTick) this.shootBullet()
        }
    }

    shootBullet() {
        const bullet = new Bullet(this.position.x, this.position.y, this.rotation, CONFIG.GAME.BULLET_SPEED, this.color, this.radius)
        this.game.bullets.push(bullet)
        bullet.player = this
    }

    listenKeys() {
        this.socket.on(CONFIG.SOCKET.SEND_KEYS, (keys) => {
            let [vx, vy, vr, shooting] = keys
            vx = Math.sign(vx || 0) * MOVE_SPEED
            vy = Math.sign(vy || 0) * MOVE_SPEED
            vr = Math.sign(vr || 0) * ROTATION_SPEED

            this.acceleration = new Vec(vx, vy)
            if (this.acceleration.mag != 0) {
                this.acceleration.mag = this.maxAcceleration
            }
            if (isNaN(this.acceleration.x)) {
                // console.log("accel is nan")
            }
            this.shooting = shooting !== 0
            if (this.shooting) {
                this.initialBulletTick = (this.game.ticks) % CONFIG.GAME.INIT_SHOOTING_SPEED
                this.shootBullet()
            }
            this.rotateBy = vr
        })
    }

    serialize() {
        const [r, g, b] = this.color
        return {
            x: this.position.x,
            y: this.position.y,
            r: this.rotation,
            color: { r, g, b },
            name: this.name
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
        this.precision = CONFIG.GAME.PRECISION
        this.timeoutID = null
        this.last = null
        this.io = io
        this.ticks = 0
        this.frameCount = 0

        for (let player of players) {
            player.game = this
        }

    }
    addPlayer(p) {
        p.game = this
        this.players.push(p)
    }
    emit() {
        const gameData = this.serialize()
        this.io.to(this.roomId).emit(CONFIG.SOCKET.RECEIVE, gameData)
    }
    update(delta) {
        for (let p of this.players) p.update(delta, this.ticks)
        for (let b of this.bullets) b.update(delta, this.ticks)
        this.ticks ++

    }

    serialize() {
        return {
            players: this.players.map(player => player.serialize()),
            bullets: this.bullets.map(bullet => bullet.serialize()),
        }
    }

    filterBullets() {
        this.bullets = this.bullets.filter(bullet => bullet.alive)
    }

    handleCollisions() {
        for (let i = 0; i < this.bullets.length; i++) {
            for (let j = i+1; j < this.bullets.length; j++) {
                const bulletI = this.bullets[i]
                const bulletJ = this.bullets[j]
                if (!bulletI.alive || !bulletJ.alive) continue
                if (bulletI.player !== bulletJ.player) {
                    if (Bullet.colliding(this.bullets[i], this.bullets[j])) {
                        bulletI.alive = false
                        bulletJ.alive = false
                    }
                }
            }
        }
    }
    loop = () => {
        this.frameCount++
        let now = Date.now()
        let delta = now - this.last
        this.last = now
        for (let i = 0; i < this.precision; i++) this.update(delta / this.precision)

        this.handleCollisions()
        this.filterBullets()
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