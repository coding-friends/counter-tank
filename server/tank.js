const Circle = require("./circle")
const CONFIG = require("../Config")
const js01 = require("../js01")
class Tank extends Circle {
    constructor(socket) {
        this.socket = socket 
    }

    bindSocket() {
        socket.on(CONFIG.KEYS, (buffer) => {
            
        })
    }
}