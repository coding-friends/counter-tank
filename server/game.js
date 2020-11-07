const config = require("../Config")
const js01 = require("js")

class Game {
    constructor() {
        this.players = []
        this.bullets = []
        this.walls = []
        this.fps = 10
        this.precision = 10
        this.intervalID = null
    }
    emit(){
        for (let player of this.players) {
            player.socket.emit(config.SOCKET.RECEIVE, )
        }
    }
    update(){}
    start(){
        let last = Date.now()
        this.intervalID = setInterval(() => {
            let delta = Date.now() - last
            for (let i =0; i < this.precision; i++) this.update(delta/ precision)
            this.emit()
        })
    }
    stop(){
        clearInterval(this.intervalID)
    }
}