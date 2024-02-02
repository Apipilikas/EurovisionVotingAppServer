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

app.use(cors());
app.use(express.json());
app.use("/api/v1/", judgeRouter);
app.use("/api/v1/", countryRouter)

var port = process.env.PORT;

const io = new Server(3000, {
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
    server.listen(port);
    console.log("Server is listening on port " + port + " . . .");
})