const { getAllVotes, getSpecificVote, updateVotes } = require('../controllers/voteController');

const voteRouter = require('express').Router();

voteRouter.get("/votes", getAllVotes);

voteRouter.get("/votes/:countrycode/:judgecode", getSpecificVote);

voteRouter.patch("/votes/:countrycode/:judgecode", updateVotes)

module.exports = {voteRouter};