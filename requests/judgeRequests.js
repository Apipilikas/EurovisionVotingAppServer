const {DAO, Collection} = require("../dao");
const { Judge } = require("../schemas/judge");

var JudgeRequests = {};

const judgeDAO = new DAO(Collection.Judge);

JudgeRequests.getAllJudges = function() {
    return judgeDAO.getAll();
};

JudgeRequests.getSpecificJudge = function(code) {
    return judgeDAO.getSpecific(code);
};

JudgeRequests.createNewJudge = function(data) {
    let judge = new Judge(data.code, data.name, data.originCountry, data.admin);

    return judgeDAO.insert(judge, ["online"]);
};

JudgeRequests.updateJudge = function(code, data) {
    return judgeDAO.update(code, data);
};

JudgeRequests.deleteJudge = function(code) {
    return judgeDAO.delete(code);
};

module.exports = {JudgeRequests};