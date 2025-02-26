const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Un utilisateur s'est connecté :", socket.id);

  socket.on("send_message", (data) => {
    io.emit("receive_message", data); // Diffuser le message à tous
    console.info(data)
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté :", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Serveur en écoute sur le port 4000");
});
