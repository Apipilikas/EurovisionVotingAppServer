const Country = require("../country");
const Judge = require("../judge");

// Convert to objects | Converting to objects to ensure data / schema integrity

function convertToCountryArray(results) {
    let countriesArray = [];

    for (var result of results) {
        let country = new Country(result.code, result.name, result.qualified, 
                                    result.runningOrder, result.votes, result.totalVotes,
                                    result.flagColors, result.artist, result.song);
        countriesArray.push(country);
    }

    return countriesArray;
}

function convertToJudgeArray(results) {
    let judgesArray = [];

    for (var result of results) {
        let judge = new Judge(result.name, result.originCountry);
        judgesArray.push(judge);
    }

    return judgesArray;
}

// Create objects | Creating objects to ensure data / schema integrity

function createJudge(data) {
    return new Judge(data.name, data.originCountry);
}

function createCountry(data) {
    return new Country(data.code, data.name, data.qualified,
                       data.runningOrder, data.votes, data.totalVotes,
                       data.flagColors, data.artist, data.song);
}

module.exports = {
    convertToJudgeArray,
    convertToCountryArray,
    createJudge,
    createCountry
}