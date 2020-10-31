const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server); 

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("logsUpdate", response);
  };

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  
  io.on('message', (data) => {
    console.log("new message received");
    console.log(data)
    })

    io.on('newCalculation', (data) => {
        console.log("newCalculation received");
        console.log(data)
    })

  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
