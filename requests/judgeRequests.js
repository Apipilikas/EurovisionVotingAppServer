const {DAO, Collection} = require("../dao");
const { Judge } = require("../schemas/judge");

const judgeDAO = new DAO(Collection.Judge);

function getAllJudges() {
    return judgeDAO.getAll();
};

function getSpecificJudge(code) {
    return judgeDAO.getSpecific(code);
};

function createNewJudge(data) {
    let judge = new Judge(data.code, data.name, data.originCountry);

    return judgeDAO.insert(judge, ["online"]);
};

function updateJudge(code, data) {
    return judgeDAO.update(code, data);
};

function deleteJudge(code) {
    return judgeDAO.delete(code);
};

module.exports = {
    getAllJudges,
    getSpecificJudge,
    createNewJudge,
    updateJudge,
    deleteJudge
};