const Country = require("../country");
const Judge = require("../judge");

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

module.exports = {
    convertToJudgeArray,
    convertToCountryArray
}