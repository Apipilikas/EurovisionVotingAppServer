const mongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URI;

var client = new mongoClient(url);

var eurovisionDB = client.db("ev-db");
var countries = eurovisionDB.collection("countries");
var judges = eurovisionDB.collection("judges");

module.exports = {
    client,
    countries,
    judges
}