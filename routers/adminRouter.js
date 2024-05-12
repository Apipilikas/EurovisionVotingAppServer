const adminRouter = require('express').Router();
const { 
    resetRunningCountry, 
    resetVotingStatusCache, 
    resetJudgesCache, 
    resetCountriesCache, 
    resetAllCaches, 
    getAllOnlineJudges,
    setWinnerCountry,
    clearWinnerCountry} = require('../controllers/adminController');
const { VerificationUtils } = require('../utils/verificationUtils');



adminRouter.all("*", VerificationUtils.authorizeJudge);

adminRouter.post("/admin/runningCountry/reset", resetRunningCountry);

adminRouter.post("/admin/cache/votingStatus/reset", resetVotingStatusCache);

adminRouter.post("/admin/cache/judges/reset", resetJudgesCache);

adminRouter.post("/admin/cache/countries/reset", resetCountriesCache);

adminRouter.post("/admin/cache/reset", resetAllCaches);

adminRouter.post("/admin/winnerCountry", setWinnerCountry);

adminRouter.post("/admin/winnerCountry/clear", clearWinnerCountry);

adminRouter.get("/admin/onlineJudges/all", getAllOnlineJudges);

module.exports = {adminRouter};