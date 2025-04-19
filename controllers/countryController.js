const { VotingStatusesCache, CountriesCache } = require("../cache");
const { ControllerUtils } = require("../utils/controllerUtils");
const { votingSchema, VotingSchema } = require("../schemas/votingSchema");
const { DAO } = require("../dao");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");

let schema = votingSchema;
const modelName = schema.countryModel.modelName;

module.exports.getRunningCountry = (req, res, next) => {
    let runningCountry = schema.runningCountry;
    let record = schema.countryModel.records.find(rec => rec.getValue("runningOrder") == runningCountry);

    res.status(200).json({currentRunningOrder : runningCountry, runningCountry : record?.serializeForDisplay()});
};

module.exports.getAllVotingStatuses = (req, res, next) => {
    // OBSOLETE
    res.status(200).json({votingStatuses : VotingStatusesCache.getVotingStatuses()});
};

module.exports.getSpecificVotingStatus = (req, res, next) => {
    let record = schema.countryModel.records.findByPrimaryKey(req.params.countrycode);
    res.status(200).json({status : record?.getValue("votingStatus")});
};

module.exports.getAllCountries = (req, res, next) => {
    try {
        res.status(200).json({countries : schema.countryModel.serializeForDisplay()});
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetAllError(e, modelName));
    }
};

module.exports.getAllCountriesWithVotes = (req, res, next) => {
    try {
        res.status(200).json({countries : schema.countryModel.serializeWithVotesForDisplay()});
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetAllError(e, modelName));
    }
};

module.exports.getSpecificCountry = (req, res, next) => {
    let code = req.params.code;

    try {
        let record = schema.countryModel.records.findByPrimaryKey(code);

        if (record != null) {
            res.status(200).json({country : record.serializeForDisplay()});
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, code));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, code));
    }
};

module.exports.getSpecificCountryWithVotes = (req, res, next) => {
    let code = req.params.code;

    try {
        let record = schema.countryModel.records.findByPrimaryKey(code);

        if (record != null) {
            let childRecords = record.getChildRecords(VotingSchema.FK_Country_Vote);
            let childRecordsArray = [];
            childRecords?.forEach(childRecord => childRecordsArray.push(childRecord.serializeForDisplay()));

            let country = record.serializeForDisplay();
            country.votes = childRecordsArray;

            res.status(200).json({country : country});
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, code));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, code));
    }
};

module.exports.createNewCountry = (req, res, next) => {
    ControllerUtils.createRecord(req, res, schema.countryModel);
};

module.exports.updateCountry = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.updateRecord(req, res, schema.countryModel, code);
};

module.exports.checkJudgeOriginCountry = (req, res, next) => {
    let countryCode = req.params.countrycode;
    let judgeCode = req.params.judgecode;

    try {
        if (votingSchema.judgeModel.getJudgeOriginCountry(judgeCode) == countryCode) {
            let code = "CANNOT_VOTE_ORIGIN_COUNTRY_ERROR";
            let description = `Judge with code [${judgeCode}] cannot vote ones origin country [${countryCode}].`;
            res.status(409).json(new ServerErrorResponse(code, description));
            return;
        }

        next();
    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleUpdateError(e, schema.voteModel.modelName, countryCode, judgeCode));
    }
}

module.exports.clearCountryTotalVotes = async (req, res, next) => {
    let code = req.params.code;

    try {
        let records = votingSchema.voteModel.select(`countryCode = '${code}'`);
    
        if (records.length > 0) {
            let parentRecord = records[0].getParentRecord(VotingSchema.FK_Country_Vote);

            DAO.executeTransaction(async (session) => {
                for (let record of records) {
                    record.delete();
                    let result = await record.saveChanges(session);
                    if (!result.success) throw new Error(result.errorDescription);
                }
            })
            .then(response => {
                if (response.success) {

                    if (parentRecord != null) {
                        parentRecord.setValue("totalVotes", 0);
                        parentRecord.acceptChanges();
                    }

                    records.forEach(record => record.acceptChanges());
                    res.status(204).send();
                }
                else {
                    records.forEach(record => record.rejectChanges());
                    res.status(409).json(ServerErrorResponse.createDefUpdateError(response.errorDescription, modelName, code));
                }
            })
            .catch((e) => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
        }
        else {
            res.status(204).send();
        }

    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleUpdateError(e, modelName, code));
    }

}

module.exports.recalculateCountryTotalVotes = async (req, res, next) => {
    let code = req.params.code;

    try {
        let records = votingSchema.voteModel.select(`countryCode = '${code}'`);
    
        if (records.length > 0) {
            votingSchema.countryModel.totalVotesField.nonStored = false;
            let parentRecord = records[0].getParentRecord(VotingSchema.FK_Country_Vote);

            let totalVotes = 0;

            for (let record of records) {
                totalVotes += record.getValue("points");
            }
            
            parentRecord.setValue("totalVotes", totalVotes);

            parentRecord.saveAndApplyChanges().then(response => {
                if (response.success) {
                    res.status(204).send();
                }
                else {
                    res.status(409).json(ServerErrorResponse.createDefUpdateError(response.errorDescription, modelName, code));
                }
            })
            .catch((e) => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
        }
        else {
            res.status(204).send();
        }

    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleUpdateError(e, modelName, code));
    }
    finally {
        votingSchema.countryModel.totalVotesField.nonStored = true;
    }

}

module.exports.deleteCountry = (req, res, next) => {
    let code = req.params.code;

    ControllerUtils.deleteRecord(req, res, schema.countryModel, code);
};

module.exports.getWinnerCountry = (req, res, next) => {
    res.status(200).json({country : CountriesCache.getWinnerCountry()});
}