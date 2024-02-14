const countryRouter = require('express').Router();
const { getAllCountries, getSpecificCountry, createNewCountry, updateCountry, updateJudgeVotes, deleteCountry } = require('../controllers/countryController');
const { getRunningCountry, getVotingStatuses, getVotingStatusByCountryCode } = require('../global');

countryRouter.get("/countries/runningCountry", (req, res) => {
    res.status(200).json({runningCountry : getRunningCountry()});
});

countryRouter.get("/countries/votingStatuses/all", (req, res) => {
    res.status(200).json({votingStatuses : getVotingStatuses()});
});

countryRouter.get("/countries/votingStatuses/:countrycode", (req, res) => {
    res.status(200).json({status : getVotingStatusByCountryCode(req.params.countrycode)});
})

countryRouter.get("/countries/all", getAllCountries);

countryRouter.get("/countries/:code", getSpecificCountry);

countryRouter.post("/countries", createNewCountry);

countryRouter.put("/countries/:code", updateCountry);

countryRouter.patch("/countries/vote/:countrycode/:judgecode", updateJudgeVotes)

countryRouter.delete("/countries/:code", deleteCountry);

module.exports = {countryRouter};