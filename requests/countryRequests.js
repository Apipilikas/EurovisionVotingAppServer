const {DAO, Collection} = require("../dao");
const { Country } = require("../schemas/country");

const countryDAO = new DAO(Collection.Country);

module.exports.getAllCountries = () => {
    return countryDAO.getAll();
};

module.exports.getSpecificCountry = (code) => {
    return countryDAO.getSpecific(code);
};

module.exports.createNewCountry = (data) => {
    let country = Country.create(data.code, data.name, data.qualified, data.runningOrder, data.flagColors, data.artist, data.song);

    return countryDAO.insert(country);
};

module.exports.updateCountry = (code, data) => {
    return countryDAO.update(code, data);
};

module.exports.updateJudgeVotes = (countryCode, judgeCode, points) => {
    let judgeCodeParam = "votes." + judgeCode;
    let jsonData = { [judgeCodeParam] : parseInt(points) };

    return countryDAO.update(countryCode, jsonData);
};

module.exports.deleteCountry = (code) => {
    return countryDAO.delete(code);
};