function showRoom(id){
  const newUrl = `/client/room.html?id=${id}`
  window.location.href = (newUrl)
}


function createRoom(){
  const socket = io()
  socket.on("connect",()=>{
    socket.emit(CONFIG.SOCKET.CREATE_ROOM,"")
    socket.on(CONFIG.SOCKET.CREATE_ROOM,(id) => {
      // console.log("received id",id)
      showRoom(id)
    })
  })
}

document.body.onload = ()=>{
  const button = document.querySelector("button.create-button")
  button.addEventListener("click", createRoom)
  startGame()
}
