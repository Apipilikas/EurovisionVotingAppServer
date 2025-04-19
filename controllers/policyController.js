const { Record } = require("db-model-handler");
const { votingSchema, VotingSchema } = require("../schemas/votingSchema");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");
const { DAO } = require("../dao");
const { ControllerUtils } = require("../utils/controllerUtils");

const schema = votingSchema;
const modelName = schema.policyModel.modelName;

module.exports.getAllPolicies = (req, res, next) => {
    try {
        res.status(200).json({policies : schema.policyModel.serializeForDisplay()});
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetAllError(e, modelName));
    }
};

module.exports.getSpecificPolicy = (req, res, next) => {
    let code = req.params.code;
    
    try {
        let record = schema.policyModel.records.findByPrimaryKey(code);

        if (record != null) {
            let childRecords = record.getChildRecords(VotingSchema.FK_Policy_PolicyEntry);
            let childRecordsArray = [];
            childRecords?.forEach(childRecord => childRecordsArray.push(childRecord.serializeForDisplay()));

            let policy = record.serializeForDisplay();
            policy.policyEntries = childRecordsArray;

            res.status(200).json({policy : policy});
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, code));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName));
    }
};

module.exports.createNewPolicy = (req, res, next) => {
    try {
        let policyValues = Record.getCorrectValuesOrderList(schema.policyModel, req.body);
        let record = schema.policyModel.pushNewRecord(...policyValues);

        let policyEntriesBody = req.body.policyEntries;

        if (policyEntriesBody != null) {
            let policyEntriesValue = [];

            policyEntriesBody.forEach(entry => policyEntriesValue.push(Record.getCorrectValuesOrderList(schema.policyEntryModel, entry)));
            policyEntriesValue.forEach(entry => schema.policyEntryModel.pushNewRecord(...entry));
        }

        DAO.executeTransaction(async (session) => {
            await record.saveAndApplyCascadeChanges(session);
        }).then(response => {
            if (response.success) {
                res.status(204).send();
            }
            else {
                res.status(409).json(ServerErrorResponse.createDefInsertError(response.errorDescription, modelName, req.body.code));
            }
        })
    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleInsertError(e, modelName, req.body.code));
    }
};

module.exports.updatePolicy = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.updateRecord(req, res, schema.policyModel, code);
};

module.exports.updatePolicyEntry = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.updateRecord(req, res, schema.policyEntryModel, code);
}

module.exports.deletePolicy = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.deleteRecord(req, res, schema.policyModel, code);
}

module.exports.deletePolicyEntry = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.deleteRecord(req, res, schema.policyEntryModel, code);
}