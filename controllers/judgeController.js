const { JudgesCache } = require("../cache");
const { JudgeRequests } = require("../requests/judgeRequests");
const { ErrorResponse } = require("../utils/responses");

module.exports.getAllJudges = (req, res, next) => {
    if (JudgesCache.isInitialized()) {
        return res.status(200).json({judges : JudgesCache.getJudges()});
    }

    JudgeRequests.getAllJudges()
    .then(response => {
        if (response.success) {
            let judges = response.data;
            JudgesCache.setJudges(judges);
            
            res.status(200).json({judges : judges});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Judges", null).toJSON());
        }
    });
};

module.exports.getSpecificJudge = (req, res, next) => {
    let code = req.params.code;

    if (JudgesCache.isInitialized()) {
        let judge = JudgesCache.findJudge(code);

        if (judge != null) {
            return res.status(200).json({judge : judge});
        }
    }

    JudgeRequests.getSpecificJudge(code)
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
    JudgeRequests.createNewJudge(req.body)
    .then(response => {
        if (response.success) {
            JudgesCache.addJudge(req.body);
            res.status(201).send();   
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", judge.code).toJSON());
        }
    })
};

module.exports.updateJudge = (req, res, next) => {
    let code = req.params.code;

    JudgeRequests.updateJudge(code, req.body)
    .then(response => {
        if (response.success) {
            JudgesCache.updateJudge(code, req.body);
            res.status(200).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", code).toJSON());
        }
    });
};

module.exports.deleteJudge = (req, res, next) => {
    let code = req.params.code;

    JudgeRequests.deleteJudge(code)
    .then(response => {
        if (response.success) {
            JudgesCache.deleteJudge(code);
            res.status(204).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Judge", code).toJSON());
        }
    });
};