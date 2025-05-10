const { Record } = require("db-model-handler");
const { votingSchema } = require("../schemas/votingSchema");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");
const { ControllerUtils } = require("../utils/controllerUtils");
const { EmailProvider } = require("../email/emailProvider");
const { UUIDUtils } = require("../utils/uuidUtils");

let schema = votingSchema;
let modelName = votingSchema.judgeModel.modelName;
const activationToken_ID = "activationKey";

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

module.exports.registerJudge = (req, res, next) => {
    try {
        let {name, email, originCountry} = req.body;

        let code = votingSchema.judgeModel.createUniqueCode(name);
        let record = votingSchema.judgeModel.pushNewRecord(code, name, originCountry, null, false);
        
        let activationToken = UUIDUtils.generateUUID();
        record.addProperty(activationToken_ID, activationToken);

        record.saveAndApplyChanges().then(response => {
            if (response.success) {
                EmailProvider.sendActivateJudgeEmail(email, name, code, activationToken).then(response => {
                    if (response.success) {
                        res.status(201).send();
                    }
                    else {
                        res.status(404).json(ServerErrorResponse.createServerError(response.info));
                    }
                })
            }
            else {
                res.status(409).json(ServerErrorResponse.createDefInsertError(response.errorDescription, modelName, name));
            }
        })
        .catch(e => {res.status(500).json(ServerErrorResponse.createServerError(e.message))})
    }
    catch (e) {
        console.log(e)
        res.status(500).json(ServerErrorResponse.createServerError(e.message));
    }
}

module.exports.activateJudge = (req, res, next) => {
    let activationToken = req.body.activationToken;
    let code = req.body.code;

    try {
        let record = votingSchema.judgeModel.records.findByPrimaryKey(code);

        if (record != null) {
            let judgeActivationToken = record.getProperty(activationToken_ID);

            if (record.getValue("active")) {
                let code = "JUDGE_ALREADY_ACTIVATED";
                let description = `Judge with name [${record.getValue("name")}] has already been activated.`;
                res.status(409).json(new ServerErrorResponse(code, description));
                return;
            }

            if (activationToken == judgeActivationToken) {
                record.setValue("active", true);

                record.saveAndApplyChanges().then(response => {
                    if (response.success) {
                        res.status(204).send();
                    }
                    else {
                        res.status(409).json(ServerErrorResponse.createDefUpdateError(response.errorDescription, modelName, name));
                    }
                })
            }
            else {
                let code = "ACTIVATION_TOKEN_FAILURE";
                let description = `Judge with name [] cannot activate his account as ones activation key is not valid.`;
                res.status(409).json(new ServerErrorResponse(code, description));
            }
        }
        else {
            res.status(409).json(ServerErrorResponse.createNotFoundOnUpdateError(modelName, code));
        }
    }
    catch (e) {

    }

}