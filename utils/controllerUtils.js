const { Record } = require("db-model-handler");
const { DAO } = require("../dao");
const { votingSchema } = require("../schemas/votingSchema");
const { ServerErrorResponse } = require("./responses/serverErrorResponse");

var ControllerUtils = {};

/**
 * Checks if judge with a specific code has the authority to proceed. If true, continue to the next action. Otherwise, send [403] error code.
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next Next
 * @returns 
 */
ControllerUtils.authorizeJudge = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json(ServerErrorResponse.createAuthorizationError());
    }

    let judgeCode = req.headers.authorization;

    if (votingSchema.judgeModel.isJudgeAuthorized(judgeCode)) {
        next();
    }
    else {
        res.status(403).json(ServerErrorResponse.createPermissionDeniedError(judgeCode));
    }
}

ControllerUtils.createRecord = (req, res, model) => {
        try {
            let values = Record.getCorrectValuesOrderList(model, req.body)
            let record = model.pushNewRecord(...values);
    
            record.saveAndApplyChanges().then(response => {
                if (response.success) {
                    res.status(201).send();
                }
                else {
                    res.status(409).json(ServerErrorResponse.createDefInsertError(response.errorDescription, model.modelName, req.body.code));
                }
            })
            .catch(e => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
        }
        catch(e) {
            res.status(404).json(ServerErrorResponse.handleInsertError(e, model.modelName, req.body.code))
        }
}

ControllerUtils.updateRecord = (req, res, model, ...codes) => {
    try {
        let record = model.records.findByPrimaryKey(...codes);

        if (record != null) {
            record.mergeBySerialization(req.body);

            DAO.executeTransaction(async (session) => {
                await record.saveAndApplyCascadeChanges(session);
            }).then(response => {
                if (response.success) {
                    res.status(204).send();
                }
                else {
                    res.status(409).json(ServerErrorResponse.createDefUpdateError(response.errorDescription, model.modelName, ...codes));
                }
            })
            .catch((e) => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
        }
        else {
            res.status(409).json(ServerErrorResponse.createNotFoundOnUpdateError(model.modelName, ...codes));
        }
    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleUpdateError(e, model.modelName, ...codes));
    }
}

ControllerUtils.deleteRecord = (req, res, model, ...codes) => {
        try {
            let record = model.records.findByPrimaryKey(...codes);
        
            if (record != null) {
                record.delete();
    
                DAO.executeTransaction(async (session) => {
                    await record.saveAndApplyCascadeChanges(session);
                })
                .then(response => {
                    if (response.success) {
                        res.status(204).send();
                    }
                    else {
                        res.status(409).json(ServerErrorResponse.createDefDeleteError(response.errorDescription, model.modelName, ...codes));
                    }
                })
                .catch((e) => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
            }
            else {
                res.status(409).json(ServerErrorResponse.createNotFoundOnDeleteError(model.modelName, ...codes));
            }
        }
        catch(e) {
            res.status(409).json(ServerErrorResponse.handleDeleteError(e, model.modelName, ...codes));
        }
}

module.exports = { ControllerUtils };