const judgeRouter = require('express').Router();
const { 
    getAllJudges, 
    getSpecificJudge, 
    createNewJudge, 
    updateJudge, 
    deleteJudge } = require('../controllers/judgeController');
const { VerificationUtils } = require('../utils/verificationUtils');

judgeRouter.get("/judges/all", getAllJudges);

judgeRouter.get("/judges/specific/:code", getSpecificJudge);

judgeRouter.post("/judges", VerificationUtils.authorizeJudge, createNewJudge);

judgeRouter.put("/judges/:code", VerificationUtils.authorizeJudge, updateJudge);

judgeRouter.delete("/judges/:code", VerificationUtils.authorizeJudge, deleteJudge);

module.exports = {judgeRouter};