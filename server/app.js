const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const CONFIG = require("../Config.js");
const uuidv4 = require("uuid").v4

const ROOT_DIR = path.dirname(__dirname);
const CLIENT_DIR = path.join(ROOT_DIR, "client");
const PORT = process.env.PORT || 5000;

const rooms = {}
const socketRooms = {}


io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (socket.id){
      const roomId = socketRooms[socket.id]
      if (roomId !== undefined){
        delete rooms[roomId][socket.id]
        io.to(roomId).emit(CONFIG.SOCKET.JOIN_ROOM,Object.values(rooms[roomId]))
      }
    }

  });
  
  socket.on(CONFIG.SOCKET.SEND_KEYS,(value)=>{
    console.log(socket.id)
    console.log(value)
    console.log("thank you",value)
    console.log(CONFIG.SOCKET.RECEIVE)
    socket.emit(CONFIG.SOCKET.RECEIVE,value)
  })

  socket.on(CONFIG.SOCKET.CREATE_ROOM,()=>{
    console.log("received room creation request")
    const roomId = uuidv4()
    rooms[roomId] = {}
    socket.emit(CONFIG.SOCKET.CREATE_ROOM,roomId)
  })

  socket.on(CONFIG.SOCKET.JOIN_ROOM,(roomId,username)=>{
    socket.join(roomId)
    if (!rooms[roomId]) rooms[roomId] = {}
    socketRooms[socket.id] = roomId
    rooms[roomId][socket.id] = username
    io.to(roomId).emit(CONFIG.SOCKET.JOIN_ROOM,Object.values(rooms[roomId]))
  })

  socket.on(CONFIG.SOCKET.GAME_STARTED,()=>{
    const roomId = socketRooms[socket.id]
    console.log("game started for room" + roomId)
    io.to(roomId).emit(CONFIG.SOCKET.GAME_STARTED,"")
  })

});

app.use(express.static(ROOT_DIR));
http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`Server url : http://localhost:${PORT}`);
});
