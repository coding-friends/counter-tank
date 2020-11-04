const CONFIG = require("../Config")

const socket = io()
console.log("connected")
const tank = new Tank(10,10,20)
function setup(){
  createCanvas(window.innerWidth,window.innerHeight)
}

function sendKey(value){
  socket.emit(CONFIG.KEYS,value)
}

function draw(){
  background(230)
  tank.display()


}
