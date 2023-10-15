const mongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://Apipilikas:p3180157agg15@cluster.r0jin.mongodb.net/ev-db?retryWrites=true&w=majority";

var client = new mongoClient(url);

var eurovisionDB = client.db("ev-db");
var countries = eurovisionDB.collection("countries");
var judges = eurovisionDB.collection("judges");

module.exports = {
    client,
    countries,
    judges
}