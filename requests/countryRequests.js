const {DAO, Collection} = require("../dao");
const { Country } = require("../schemas/country");

const countryDAO = new DAO(Collection.Country);

function getAllCountries() {
    return countryDAO.getAll();
};

function getSpecificCountry(code) {
    return countryDAO.getSpecific(code);
};

function createNewCountry(data) {
    let country = Country.create(data.code, data.name, data.qualified, data.runningOrder, data.flagColors, data.artist, data.song);

    return countryDAO.insert(country);
};

function updateCountry(code, data) {
    return countryDAO.update(code, data);
};

function updateJudgeVotes(countryCode, judgeCode, points) {
    let judgeCodeParam = "votes." + judgeCode;
    let jsonData = { [judgeCodeParam] : parseInt(points) };

    return countryDAO.update(countryCode, jsonData);
};

function deleteCountry(code) {
    return countryDAO.delete(code);
};

module.exports = {
    getAllCountries,
    getSpecificCountry,
    createNewCountry,
    updateCountry,
    updateJudgeVotes,
    deleteCountry
};