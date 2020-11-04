const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const Config = require("../Config.js")

const ROOT_DIR = path.dirname(__dirname);
const CLIENT_DIR = path.join(ROOT_DIR, "client");
const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on(Config.KEYS,()=>{

  })
});

app.use(express.static(CLIENT_DIR));
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Server url : http://localhost:${PORT}`);
});
