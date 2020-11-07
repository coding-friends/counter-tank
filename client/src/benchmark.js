
let input01 = js01(CONFIG.INPUT_SCHEMA)

let output01 = js01(CONFIG.OUTPUT_SCHEMA)



const socket = io()
socket.on(CONFIG.SOCKET.RECEIVE, () => {

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

// function sendKeys(){
//   // const schema = JSON.stringify(getSchema())
//   const schema = input01.encode(getSchema())
//   console.log(schema)
//   let now = Date.now()
//   for (let i =0 ; i < 10000; i++){
//     socket.emit(CONFIG.SOCKET.SEND_KEYS,new ArrayBuffer(10))
//   }
//   let end = Date.now()
//   console.log("time taken",end - now)
// }
//puis?
function binaryStringToArrayBuffer(data) {

    while (data.length % 8 != 0) {
        data = '0' + data;
    }

    var buf = new ArrayBuffer(data.length / 8);
    var result = new Uint8Array(buf);


    var dataArray = data.split('');

    var idx = 0;
    while (dataArray.length > 0) {
        var bits = dataArray.splice(0, 8);
        var bitsAsInt = parseInt(bits.join(''), 2);

        result[idx] = bitsAsInt;
        idx++;
    }
    return result.buffer;
}
let times = 1e4

function benchmarkSend(data) {
    console.log("benchmarking", data)
    let now = Date.now()
    for (let i = 0; i < times; i++) {
        socket.emit(CONFIG.SOCKET.SEND_KEYS, data)
    }
    let end = Date.now()
    console.log("time taken", end - now)
}
function benchmarkBuffer() {
    let schema = binaryStringToArrayBuffer("101")
    benchmarkSend(schema)
}
function benchmarkInts() {
    let schema = [1, -1, 0]
    benchmarkSend(schema)
}
function benchmark() {
    let schema = [true, false, true, false, true, false]
    benchmarkSend(schema)
}

function compare() {
    benchmarkBuffer()
    benchmarkInts()
    benchmark()
}
function draw() {
    background(230)
    tank.display()


}
