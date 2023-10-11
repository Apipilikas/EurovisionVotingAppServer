const mongoClient = require('mongodb').MongoClient;

const url = "mongodb+srv://Apipilikas:p3180157agg15@cluster.r0jin.mongodb.net/euvision-db?retryWrites=true&w=majority";

var client = new mongoClient(url);

var eurovisionDB = client.db("euvision-db");
var countries = eurovisionDB.collection("countries");
var judges = eurovisionDB.collection("judges");

module.exports = {
    client,
    countries,
    judges
}