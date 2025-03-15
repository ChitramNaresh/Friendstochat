const socket = io("https://friendstochat.onrender.com");
let room = null;

function connectToStranger() {
    socket.emit("findStranger");
}

socket.on("roomAssigned", (assignedRoom) => {
    room = assignedRoom;
    document.getElementById("chat-box").innerHTML = "Connected! Start chatting...";
});

function sendMessage() {
    const input = document.getElementById("message");
    if (room && input.value.trim() !== "") {
        socket.emit("message", { room, message: input.value });
        displayMessage("You: " + input.value);
        input.value = "";
    }
}

socket.on("message", (msg) => {
    displayMessage("Stranger: " + msg);
});

function displayMessage(msg) {
    const chatBox = document.getElementById("chat-box");
    const div = document.createElement("div");
    div.innerText = msg;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}