const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const server = http.createServer(app);
const { Server } = require('socket.io');
const DAO = require('./utils/dao');

app.use(cors());
app.use(express.json());

var port = process.env.PORT;

const io = new Server(3000, {
    cors: {
        origin: "*"
    }
});

const mongodb = require('./mongodb');
const Judge = require('./judge');
const { createJudge, convertToJudgeArray, convertToCountryArray, createCountry } = require('./utils/dataUtils');

const client = mongodb.client;
const judgeDAO = new DAO.DAO(DAO.Collection.Judge);
const countryDAO = new DAO.DAO(DAO.Collection.Country);

app.get("/", (req, res) => {
    res.json({message : "Welcome"});
});

// Judges

app.get("/judges/all", (req, res) => {
    judgeDAO.getAll()
    .then(response => {
        if (response.success) {
            res.status(200).json(convertToJudgeArray(response.data));
        }
    });
});

app.get("/judges/:name", (req, res) => {
    if (checkContentType(req)) {
        
    }
});

app.post("/judge", (req, res) => {
    let judge = createJudge(req.body);

    judgeDAO.insert(judge, ["online"])
    .then(response => {
        if (response.success) res.status(201).send();
        else res.status(409).send();
    })

});

app.put("/judge/:name", (req, res) => {
    if (checkContentType(req)) {
        judgeDAO.update(req.params.name, req.body)
        .then(ack => {
            if (ack) res.status(200).send();
            else res.status(409).send();
        })
    }
});

app.delete("/judge/:name", (req, res) => {
    if (checkContentType(req)) {
        judgeDAO.delete(req.params.name)
        .then(ack => {
            if (ack) res.status(204).send();
            else res.status(409).send();
        })
    }
});

// Countries

app.get("/country/runningCountry", (req, res) => {
    if (checkContentType(req)) {
        res.status(200).send({runningOrder : 0});
    }
});

app.get("/countries/all", (req, res) => {
    if (checkContentType(req)) {
        countryDAO.getAll()
        .then(results => {
            res.status(200).send(convertToCountryArray(results));
        });
    }
});

app.get("/countries/:code", (req, res) => {

});

app.post("/country", (req, res) => {
    if (checkContentType(req)) {
        let country = createCountry(req.body);

        countryDAO.insert(country)
        .then(ack => {
            if (ack) res.status(201).send();
            else res.status(409).send();
        })
    }
});

app.put("/country/:code", (req, res) => {
    if (checkContentType(req)) {
        countryDAO.update(req.params.code, req.body)
        .then(ack => {
            if (ack) res.status(200).send();
            else res.status(409).send();
        })
    }
});

app.delete("/country/:code", (req, res) => {
    if (checkContentType(req)) {
        countryDAO.delete(req.params.code)
        .then(ack => {
            if (ack) res.status(204).send();
            else res.status(409).send();
        })
    }
});

function checkContentType(req) {
    let contenType = req.header("Content-Type");

    if (contenType === "application/json") return true;
    return false;
}

// Sockets

io.on("connection", (socket) => {
    console.log("New connection");
    socket.emit("hi", "hi");
})

client.connect()
.then(() => {
    console.log("Database connected successfully!")
    server.listen(port);
    console.log("Server is listening at port " + port + "...");
})