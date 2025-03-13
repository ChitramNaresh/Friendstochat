require("dotenv").config();
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
app.get("/", (req, res) => {
  res.send("Friendstochat.com Server is Running...");
});

let users = {};

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    users[socket.id] = userId;
    socket.to(roomId).emit("user-connected", userId);
  });

  socket.on("message", (data) => {
    io.to(data.room).emit("message", { user: data.user, text: data.text });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
const setupPeerServer = require("./utils/peer");
app.use("/peerjs", setupPeerServer(server));
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));