const judgeRouter = require('express').Router();
const { 
    getAllJudges, 
    getSpecificJudge, 
    createNewJudge, 
    updateJudge, 
    deleteJudge, 
    fetchData,
    registerJudge,
    activateJudge} = require('../controllers/judgeController');
const { fetchVotingSchemaData } = require('../schemas/votingSchema');
const { VerificationUtils } = require('../utils/controllerUtils');

judgeRouter.all("*", fetchVotingSchemaData);

judgeRouter.get("/judges/all", getAllJudges);

judgeRouter.get("/judges/specific/:code", getSpecificJudge);

judgeRouter.post("/judges", createNewJudge);

judgeRouter.post("/judges/register/", registerJudge);

judgeRouter.patch("/judges/activate", activateJudge);

judgeRouter.put("/judges/:code", updateJudge);

judgeRouter.delete("/judges/:code", deleteJudge);

module.exports = {judgeRouter};