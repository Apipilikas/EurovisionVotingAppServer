const adminRouter = require('express').Router();
const { 
    resetRunningCountry, 
    resetVotingStatusCache, 
    resetJudgesCache, 
    resetCountriesCache, 
    resetAllCaches, 
    getAllOnlineJudges} = require('../controllers/adminController');
const { authorizeJudge } = require('../utils/utils');


adminRouter.all("*", authorizeJudge);

adminRouter.get("/admin/runningCountry/reset", resetRunningCountry);

adminRouter.get("/admin/cache/votingStatus/reset", resetVotingStatusCache);

adminRouter.get("/admin/cache/judges/reset", resetJudgesCache);

adminRouter.get("/admin/cache/countries/reset", resetCountriesCache);

adminRouter.get("/admin/cache/reset", resetAllCaches);

adminRouter.get("/admin/onlineJudges/all", getAllOnlineJudges);

module.exports = {adminRouter};