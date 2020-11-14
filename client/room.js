
const name = prompt("Enter your name");
const roomId = new URLSearchParams(window.location.search).get("id");
document.querySelector("#room-id").innerHTML = roomId;


function setParticipants(participants){
  const participantsContainer = document.querySelector("#participants-container")
  const innerHTML = participants.map(participant => `<li class="participant">${participant}</li>`).join("")

  participantsContainer.innerHTML = innerHTML
}



socket.emit(CONFIG.SOCKET.JOIN_ROOM,roomId,name)
socket.on(CONFIG.SOCKET.JOIN_ROOM,(participants)=>{
  // console.log("receive joined room")
  setParticipants(participants)
})

socket.on(CONFIG.SOCKET.GAME_STARTED,()=>{
  startGame()
})

document.querySelector("#play-button").addEventListener("click",()=>{
  socket.emit(CONFIG.SOCKET.GAME_STARTED,"")
})