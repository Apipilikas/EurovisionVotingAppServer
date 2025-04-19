const { Record } = require("db-model-handler");
const { votingSchema } = require("../schemas/votingSchema");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");
const { ControllerUtils } = require("../utils/controllerUtils");

let schema = votingSchema;
let modelName = votingSchema.judgeModel.modelName;

module.exports.getAllJudges = (req, res, next) => {
    try {
        res.status(200).json({judges : schema.judgeModel.serializeForDisplay()});
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetAllError(e, modelName));
    }
};

module.exports.getSpecificJudge = (req, res, next) => {
    let code = req.params.code;
    
    try {
        let record = schema.judgeModel.records.findByPrimaryKey(code);
    
        if (record != null) {
            res.status(200).json({judge : record.serializeForDisplay()});
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, code));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, code));
    }
};

module.exports.createNewJudge = (req, res, next) => {
    ControllerUtils.createRecord(req, res, schema.judgeModel);
};

module.exports.updateJudge = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.updateRecord(req, res, schema.judgeModel, code);
};

module.exports.deleteJudge = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.deleteRecord(req, res, schema.judgeModel, code);
};