const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(cors());

let waitingUser = null;

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("findStranger", () => {
        if (waitingUser) {
            const room = `room-${waitingUser.id}-${socket.id}`;
            socket.join(room);
            waitingUser.join(room);
            io.to(room).emit("roomAssigned", room);
            waitingUser = null;
        } else {
            waitingUser = socket;
        }
    });

    socket.on("message", ({ room, message }) => {
        socket.to(room).emit("message", message);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (waitingUser === socket) {
            waitingUser = null;
        }
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});