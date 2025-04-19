const { getAllVotes, getSpecificVote, getVotesByJudge, getVotesByCountry, updateVotes } = require('../controllers/voteController');

const voteRouter = require('express').Router();

voteRouter.get("/votes/all", getAllVotes);

voteRouter.get("/votes/specific/:countrycode/:judgecode", getSpecificVote);

voteRouter.get("/votes/judge/specific/:judgecode", getVotesByJudge);

voteRouter.get("/votes/country/specific/:countrycode", getVotesByCountry);

voteRouter.patch("/votes/:countrycode/:judgecode", updateVotes)

module.exports = {voteRouter};