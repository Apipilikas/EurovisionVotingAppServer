const mongoClient = require('mongodb').MongoClient;

const url = process.env.MONGODB_URI;

var client = new mongoClient(url);

var eurovisionDB = client.db("ev-db");
var countries = eurovisionDB.collection("countries");
var judges = eurovisionDB.collection("judges");
let votes = eurovisionDB.collection("votes");
let policies = eurovisionDB.collection("policies");
let policyEntries = eurovisionDB.collection("policyEntries");

module.exports = {
    client,
    countries,
    judges,
    votes,
    policies,
    policyEntries
}