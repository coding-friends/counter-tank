//initializing all variables and connecting to socket
let schema;
const socket = io();
let start = Date.now();
const KEYS = {};
console.log("connected");
let tank;

// function setup for creating canvas and initializing players
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  tank = new Tank(20, 20, 20);
}

//handling key pressed and sending them
function keyPressed(e) {
  KEYS[e.key] = true;
  console.log(KEYS);
  sendKeys();
}

//handling key release and then sending them
function keyReleased(e) {
  KEYS[e.key] = false;
  sendKeys();
}

//getting schema for the keys, array of three elements
//first elem : -1 for left, 1 for right, 0 for nothing
//second elem : -1 for up, 1 for down, 0 for nothing
//third elem : -1 for counterclockwise, 1 for clockwise, 0 for nothing
function getSchema() {
  const x = ((KEYS.a) ? -1 : 0) + ((KEYS.d) ? 1 : 0);
  const y = ((KEYS.w) ? -1 : 0) + ((KEYS.s) ? 1 : 0);
  const r = ((KEYS.ArrowLeft) ? -1 : 0) + ((KEYS.ArrowRight) ? 1 : 0);
  return [x, y, r];
}

//sending keys to socket io with emit
function sendKeys() {
  console.log("sending");
  start = Date.now();
  socket.emit(CONFIG.SOCKET.SEND_KEYS, getSchema());
}

//game loop
function draw() {
  background(230);
  tank.display();
}

//handling received message from socket
socket.on(CONFIG.SOCKET.RECEIVE, (data) => {
  let lapse = Date.now() - start;
  console.log("time taken", lapse);
  console.log("received", data);
});
