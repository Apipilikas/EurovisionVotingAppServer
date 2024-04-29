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
    clearTotalVotes,
    getWinnerCountry} = require('../controllers/countryController');
const { VerificationUtils } = require('../utils/verificationUtils');

countryRouter.get("/countries/runningCountry", getRunningCountry);

countryRouter.get("/countries/votingStatuses/all", getAllVotingStatuses);

countryRouter.get("/countries/votingStatuses/:countrycode", getSpecificVotingStatus);

countryRouter.get("/countries/all", getAllCountries);

countryRouter.get("/countries/specific/:code", getSpecificCountry);

countryRouter.get("/countries/winnerCountry", getWinnerCountry);

countryRouter.post("/countries", VerificationUtils.authorizeJudge, createNewCountry);

countryRouter.put("/countries/:code", VerificationUtils.authorizeJudge, updateCountry);

countryRouter.patch("/countries/vote/:countrycode/:judgecode", updateJudgeVotes)

countryRouter.patch("/countries/totalVotes/clear", VerificationUtils.authorizeJudge, clearTotalVotes);

countryRouter.delete("/countries/:code", VerificationUtils.authorizeJudge, deleteCountry);

module.exports = {countryRouter};