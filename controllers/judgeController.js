const { setJudges } = require("../cache");
const { getAllJudges, getSpecificJudge, createNewJudge, deleteJudge, updateJudge } = require("../requests/judgeRequests");
const { Judge } = require("../schemas/judge");
const { ErrorResponse } = require("../utils/responses");

module.exports.getAllJudges = (req, res, next) => {
    getAllJudges()
    .then(response => {
        if (response.success) {
            let judges = Judge.convertToArray(response.data);
            setJudges(judges);
            
            res.status(200).json({judges : judges});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Judges", null).toJSON());
        }
    });
};

module.exports.getSpecificJudge = (req, res, next) => {
    let code = req.params.code;

    getSpecificJudge(code)
    .then(response => {
        if (response.success) {
            res.status(200).json({judge : response.data});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Judge", code).toJSON());
        }
    });
};

module.exports.createNewJudge = (req, res, next) => {
    createNewJudge(req.body)
    .then(response => {
        if (response.success) res.status(201).send();
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", judge.code).toJSON());
        }
    })
};

module.exports.updateJudge = (req, res, next) => {
    let code = req.params.code;

    updateJudge(code, req.body)
    .then(response => {
        if (response.success) res.status(200).send();
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", code).toJSON());
        }
    });
};

module.exports.deleteJudge = (req, res, next) => {
    let code = req.params.code;

    deleteJudge(code)
    .then(response => {
        if (response.success) res.status(204).send();
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", code).toJSON());
        }
    });
};