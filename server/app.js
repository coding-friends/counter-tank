const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const CONFIG = require("../Config.js");

const ROOT_DIR = path.dirname(__dirname);
const CLIENT_DIR = path.join(ROOT_DIR, "client");
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on(CONFIG.SOCKET.SEND_KEYS,(value)=>{
    console.log("thank you",value)
    console.log(CONFIG.SOCKET.RECEIVE)
    socket.emit(CONFIG.SOCKET.RECEIVE,value)
  })
});

app.use(express.static(ROOT_DIR));
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Server url : http://localhost:${PORT}`);
});
