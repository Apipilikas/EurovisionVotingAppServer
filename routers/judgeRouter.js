const judgeRouter = require('express').Router();
const { 
    getAllJudges, 
    getSpecificJudge, 
    createNewJudge, 
    updateJudge, 
    deleteJudge } = require('../controllers/judgeController');

judgeRouter.get("/judges/all", getAllJudges);

judgeRouter.get("/judges/:code", getSpecificJudge);

judgeRouter.post("/judges", createNewJudge);

judgeRouter.put("/judges/:code", updateJudge);

judgeRouter.delete("/judges/:code", deleteJudge);

module.exports = {judgeRouter};