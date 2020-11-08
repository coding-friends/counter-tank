
let canvas;
let start = Date.now()
let game = {
  players: [],
  bullets: []
};
let KEYS = {}
function startGame() {
  document.querySelector("#container").remove()
  canvas = createCanvas(window.innerWidth, window.innerHeight)
}

//handling received message from socket

socket.on(CONFIG.SOCKET.RECEIVE, (newGame) => {
  // let lapse = Date.now() - start;
  // console.log("time taken", lapse);
  // console.log("received", newGame);
  game = newGame
  start = Date.now()
});

function draw() {
  display(game)
}
function display(game) {
  background(240)
  const { players, bullets } = game

  for (let player of players) {
    fill(player.color.r, player.color.g, player.color.b)
    ellipse(player.x, player.y, 2 * CONFIG.GAME.PLAYER_R, 2 * CONFIG.GAME.PLAYER_R)
    textAlign("CENTER")
    fill(0)
    text(player.name, player.x, player.y)
  }

  for (let bullet of bullets) {
    ellipse(bullet.x, bullet.y, CONFIG.GAME.BULLET_R, CONFIG.GAME.BULLET_R)
  }
}
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

