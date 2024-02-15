const countryRouter = require('express').Router();
const { 
    getAllCountries, 
    getSpecificCountry, 
    createNewCountry, 
    updateCountry, 
    updateJudgeVotes, 
    deleteCountry, 
    getRunningCountry, 
    getSpecificVotingStatus, 
    getAllVotingStatuses } = require('../controllers/countryController');

countryRouter.get("/countries/runningCountry", getRunningCountry);

countryRouter.get("/countries/votingStatuses/all", getAllVotingStatuses);

countryRouter.get("/countries/votingStatuses/:countrycode", getSpecificVotingStatus);

countryRouter.get("/countries/all", getAllCountries);

countryRouter.get("/countries/:code", getSpecificCountry);

countryRouter.post("/countries", createNewCountry);

countryRouter.put("/countries/:code", updateCountry);

countryRouter.patch("/countries/vote/:countrycode/:judgecode", updateJudgeVotes)

countryRouter.delete("/countries/:code", deleteCountry);

module.exports = {countryRouter};