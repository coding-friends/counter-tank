const name = prompt("Enter your name");
const roomId = new URLSearchParams(window.location.search).get("id");
document.querySelector("#room-id").innerHTML = roomId;
const socket = io();


function setParticipants(participants){
  const participantsContainer = document.querySelector("#participants-container")
  const innerHTML = participants.map(participant => `<li class="participant">${participant}</li>`).join("")

  participantsContainer.innerHTML = innerHTML
}
socket.on("connect", () => {
  socket.emit(CONFIG.SOCKET.JOIN_ROOM,roomId,name)
  socket.on(CONFIG.SOCKET.JOIN_ROOM,(participants)=>{
    setParticipants(participants)
  })
});
