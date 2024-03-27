const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const server = http.createServer(app);
const { judgeRouter } = require('./routers/judgeRouter');
const mongodb = require('./mongodb');
const { countryRouter } = require('./routers/countryRouter');
const { SocketIO } = require('./socketio');
const { adminRouter } = require('./routers/adminRouter');
const client = mongodb.client;
const prefix = "/api/v1/";

app.use(cors());
app.use(express.json());
app.use(prefix, judgeRouter);
app.use(prefix, countryRouter);
app.use(prefix, adminRouter);

const serverPort = process.env.SERVER_PORT;

// Sockets

SocketIO.getSocketIO();

// Set connections

client.connect()
.then(() => {
    console.log("Database connected successfully!")
    server.listen(serverPort);
    console.log("Server is listening on port " + serverPort + " . . .");
});