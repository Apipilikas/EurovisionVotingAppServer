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
    getAllVotingStatuses, 
    clearTotalVotes} = require('../controllers/countryController');
const { authorizeJudge } = require('../utils/utils');

countryRouter.get("/countries/runningCountry", getRunningCountry);

countryRouter.get("/countries/votingStatuses/all", getAllVotingStatuses);

countryRouter.get("/countries/votingStatuses/:countrycode", getSpecificVotingStatus);

countryRouter.get("/countries/all", getAllCountries);

countryRouter.get("/countries/:code", getSpecificCountry);

countryRouter.post("/countries", authorizeJudge, createNewCountry);

countryRouter.put("/countries/:code", authorizeJudge, updateCountry);

countryRouter.patch("/countries/vote/:countrycode/:judgecode", updateJudgeVotes)

countryRouter.patch("countries/totalVotes/clear", authorizeJudge, clearTotalVotes);

countryRouter.delete("/countries/:code", authorizeJudge, deleteCountry);

module.exports = {countryRouter};