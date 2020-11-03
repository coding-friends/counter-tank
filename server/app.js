const express = require("express")
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require("path")

const ROOT_DIR = path.dirname(__dirname)
const CLIENT_DIR = path.join(ROOT_DIR, "client")
const PORT = process.env.PORT || 8080

app.use(express.static(CLIENT_DIR))


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
    console.log(`Server url : http://localhost:${PORT}`)
})

io.on("connection", (socket) => {
    console.log("a user connected")
    socket.on('disconnect',()=>{
        console.log("user disconnected")
    })

    socket.on('')
})