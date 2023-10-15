const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(cors());
app.use(express.json());

const mongodb = require('./mongodb');

const client = mongodb.client;

client.connect()
.then(() => {
    console.log("Database connected successfully!")
    server.listen(8080);
    console.log("Server is listening...");
})