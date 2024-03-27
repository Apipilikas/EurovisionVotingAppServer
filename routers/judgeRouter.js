const judgeRouter = require('express').Router();
const { 
    getAllJudges, 
    getSpecificJudge, 
    createNewJudge, 
    updateJudge, 
    deleteJudge } = require('../controllers/judgeController');
const { authorizeJudge } = require('../utils/utils');

judgeRouter.get("/judges/all", getAllJudges);

judgeRouter.get("/judges/:code", getSpecificJudge);

judgeRouter.post("/judges", authorizeJudge, createNewJudge);

judgeRouter.put("/judges/:code", authorizeJudge, updateJudge);

judgeRouter.delete("/judges/:code", authorizeJudge, deleteJudge);

module.exports = {judgeRouter};