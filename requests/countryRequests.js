const {DAO, Collection} = require("../dao");
const { Country } = require("../schemas/country");

var CountryRequests = {};

const countryDAO = new DAO(Collection.Country);

CountryRequests.getAllCountries = function() {
    return countryDAO.getAll();
};

CountryRequests.getSpecificCountry = function(code) {
    return countryDAO.getSpecific(code);
};

CountryRequests.createNewCountry = function(data) {
    let country = Country.create(data.code, data.name, data.qualified, data.runningOrder, data.flagColors, data.artist, data.song);

    return countryDAO.insert(country);
};

CountryRequests.updateCountry = function(code, data) {
    return countryDAO.update(code, data);
};

CountryRequests.updateJudgeVotes = function(countryCode, judgeCode, points) {
    let judgeCodeParam = "votes." + judgeCode;
    let jsonData = { [judgeCodeParam] : parseInt(points) };

    return countryDAO.update(countryCode, jsonData);
};

CountryRequests.deleteCountry = function(code) {
    return countryDAO.delete(code);
};

module.exports = {CountryRequests};