const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const server = http.createServer(app);
const { Server } = require('socket.io');
const { judgeRouter } = require('./routers/judgeRouter');
const mongodb = require('./mongodb');
const { countryRouter } = require('./routers/countryRouter');
const client = mongodb.client;
const prefix = "/api/v1/";

app.use(cors());
app.use(express.json());
app.use(prefix, judgeRouter);
app.use(prefix, countryRouter)

var serverPort = process.env.SERVER_PORT;
const socketIOPort = process.env.SOCKETIO_PORT;

const io = new Server(socketIOPort, {
    cors: {
        origin: "*"
    }
});

// Sockets

io.on("connection", (socket) => {
    console.log("New connection");
    socket.emit("hi", "hi");
})

// Set connections

client.connect()
.then(() => {
    console.log("Database connected successfully!")
    server.listen(serverPort);
    console.log("Server is listening on port " + serverPort + " . . .");
})