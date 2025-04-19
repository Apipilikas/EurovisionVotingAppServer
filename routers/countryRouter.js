const countryRouter = require('express').Router();
const { 
    getAllCountries, 
    getSpecificCountry, 
    createNewCountry, 
    updateCountry, 
    deleteCountry, 
    getRunningCountry, 
    getSpecificVotingStatus, 
    getAllVotingStatuses, 
    getWinnerCountry,
    clearCountryTotalVotes,
    recalculateCountryTotalVotes,
    getAllCountriesWithVotes,
    getSpecificCountryWithVotes} = require('../controllers/countryController');

countryRouter.get("/countries/runningCountry", getRunningCountry);

countryRouter.get("/countries/votingStatuses/all", getAllVotingStatuses);

countryRouter.get("/countries/votingStatuses/:countrycode", getSpecificVotingStatus);

countryRouter.get("/countries/all", getAllCountries);

countryRouter.get("/countries/votes/all", getAllCountriesWithVotes);

countryRouter.get("/countries/specific/:code", getSpecificCountry);

countryRouter.get("/countries/votes/specific/:code", getSpecificCountryWithVotes);

countryRouter.get("/countries/winnerCountry", getWinnerCountry);

countryRouter.post("/countries", createNewCountry);

countryRouter.put("/countries/:code", updateCountry);

countryRouter.patch("/countries/totalVotes/clear/:code", clearCountryTotalVotes);

countryRouter.patch("/countries/totalVotes/recalculate/:code", recalculateCountryTotalVotes);

countryRouter.delete("/countries/:code", deleteCountry);

module.exports = {countryRouter};