let schema;
const socket = io()
let start = Date.now()
socket.on(CONFIG.SOCKET.RECEIVE, (data) => {
  let lapse = Date.now() - start
  console.log("time taken", lapse)
  console.log("received", data)

})
console.log("connected")
let tank;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight)
  tank = new Tank(20, 20, 20)
}

const KEYS = {}
function keyPressed(e) {
  KEYS[e.key] = true
  console.log(KEYS)
  sendKeys()
}
function keyReleased(e) {
  KEYS[e.key] = false
  sendKeys()
}

function getSchema() {
  const x = ((KEYS.a) ? -1 : 0) + ((KEYS.d) ? 1 : 0)
  const y = ((KEYS.w) ? -1 : 0) + ((KEYS.s) ? 1 : 0)
  const r = ((KEYS.ArrowLeft) ? -1 : 0) + ((KEYS.ArrowRight) ? 1 : 0)
  return [x, y, r]
}

function sendKeys() {
  console.log("sending")
  start = Date.now()
  socket.emit(CONFIG.SOCKET.SEND_KEYS, getSchema())
}

function draw() {
  background(230)
  tank.display()


}
