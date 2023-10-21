const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const DAO = require('./utils/dao');

app.use(cors());
app.use(express.json());

const mongodb = require('./mongodb');
const Judge = require('./judge');

const client = mongodb.client;
const judgeDAO = new DAO.DAO(DAO.Collection.Judge);

// Judges

app.get("/judges/all", (req, res) => {
    if (checkContentType(req)) {
        let judge = new Judge("aggelos15", "GR");
        //judgeDAO.insert(judge, ["online"]).then(ack => {console.log(ack)});
        //judgeDAO.update("aggelos15", {originCountry: "POL"})
        //.then(result => { console.log(result) });

        judgeDAO.delete("aggelos15").then(result => console.log(result));

        judgeDAO.getAll()
        .then(judges => {
            res.send(judges);
        });
    }
});

app.get("/judges/:name", (req, res) => {
    if (checkContentType(req)) {
        
    }
});

app.post("/judge", (req, res) => {
    if (checkContentType(req)) {

    }
});

app.put("/judge/:name", (req, res) => {
    if (checkContentType(req)) {

    }
});

app.delete("/judge/:name", (req, res) => {

});

// Countries

app.get("/countries/all", (req, res) => {

});

app.get("/countries/:code", (req, res) => {

});

app.post("/country", (req, res) => {

});

app.put("/country/:code", (req, res) => {

});

app.delete("/country/:code", (req, res) => {

});

function checkContentType(req) {
    let contenType = req.header("Content-Type");

    if (contenType === "application/json") return true;

    return false;
}

client.connect()
.then(() => {
    console.log("Database connected successfully!")
    server.listen(8080);
    console.log("Server is listening...");
})