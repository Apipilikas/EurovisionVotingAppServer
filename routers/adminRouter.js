const adminRouter = require('express').Router();
const { 
    resetRunningCountry, 
    resetVotingStatus, 
    resetAllCaches, 
    getAllOnlineJudges,
    setWinnerCountry,
    clearWinnerCountry} = require('../controllers/adminController');
const { ControllerUtils } = require('../utils/controllerUtils');

adminRouter.all("/admin*", ControllerUtils.authorizeJudge);

adminRouter.post("/admin/runningCountry/reset", resetRunningCountry);

adminRouter.post("/admin/votingStatus/reset", resetVotingStatus);

adminRouter.post("/admin/cache/reset", resetAllCaches);

adminRouter.post("/admin/winnerCountry", setWinnerCountry);

adminRouter.post("/admin/winnerCountry/clear", clearWinnerCountry);

adminRouter.get("/admin/onlineJudges/all", getAllOnlineJudges);

module.exports = {adminRouter};