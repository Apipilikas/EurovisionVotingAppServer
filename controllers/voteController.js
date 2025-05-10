const { votingSchema, VotingSchema } = require("../schemas/votingSchema");
const { SocketIO } = require("../socketio");
const { ControllerUtils } = require("../utils/controllerUtils");
const { VotesMapper, PolicyApplier } = require("../utils/policyApplier");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");

const modelName = votingSchema.voteModel.modelName;

module.exports.getAllVotes = (req, res, next) => {
    try {
        res.status(200).json({votes : votingSchema.voteModel.serializeForDisplay()});
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetAllError(e, modelName));
    }
}

module.exports.getSpecificVote = (req, res, next) => {
    let countryCode = req.params.countrycode;
    let judgeCode = req.params.judgecode;

    try {
        let record = votingSchema.voteModel.records.findByPrimaryKey(countryCode, judgeCode);
        
        if (record != null) {
            res.status(200).json({vote : record.serializeForDisplay()});
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, countryCode, judgeCode));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, countryCode, judgeCode));
    }
}

module.exports.getVotesByJudge = (req, res, next) => {
    let judgeCode = req.params.judgecode;

    try {
        let record = votingSchema.judgeModel.records.findByPrimaryKey(judgeCode);
        
        if (record != null) {
            let childRecords = record.getChildRecords(VotingSchema.FK_Judge_Vote);

            if (childRecords == null || childRecords.length == 0) {
                res.status(404).json(ServerErrorResponse.createGetSpecificError(`No votes found for judge with code [${judgeCode}]`));
            }
            else {
                let serializedRecords = childRecords.map(childRecord => childRecord.serializeForDisplay()); 
                res.status(200).json({votes : serializedRecords});
            }
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, judgeCode));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, judgeCode));
    }
}

module.exports.getVotesByCountry = (req, res, next) => {
    let countryCode = req.params.countrycode;

    try {
        let record = votingSchema.countryModel.records.findByPrimaryKey(countryCode);
        
        if (record != null) {
            let childRecords = record.getChildRecords(VotingSchema.FK_Country_Vote);

            if (childRecords == null || childRecords.length == 0) {
                res.status(404).json(ServerErrorResponse.createGetSpecificError(`No votes found for country with code [${countryCode}]`));
            }
            else {
                let serializedRecords = childRecords.map(childRecord => childRecord.serializeForDisplay()); 
                res.status(200).json({votes : serializedRecords});
            }
        }
        else {
            res.status(404).json(ServerErrorResponse.createNotFoundOnGetError(modelName, countryCode));
        }
    }
    catch(e) {
        res.status(404).json(ServerErrorResponse.handleGetSpecificError(e, modelName, countryCode));
    }
}

module.exports.updateVotes = (req, res, next) => {
    let countryCode = req.params.countrycode;
    let judgeCode = req.params.judgecode;
    let points = req.body.points;
    let prevPoints = 0

    try {
        let judgeRecord = votingSchema.judgeModel.records.findByPrimaryKey(judgeCode);
        let countryRecord = votingSchema.countryModel.records.findByPrimaryKey(countryCode);

        // Check Judges origin country

        if (judgeRecord?.getValue("originCountry") == countryCode) {
            let code = "CANNOT_VOTE_ORIGIN_COUNTRY_ERROR";
            let description = `Judge with code [${judgeCode}] cannot vote ones origin country [${countryCode}].`;
            res.status(409).json(new ServerErrorResponse(code, description));
            return;
        }

        // Check country voting status

        if (countryRecord?.getValue("votingStatus") != "OPEN") {
            let code = "COUNTRY_WITH_NOT_OPEN_VOTING_STATUS_ERROR";
            let description = `Judge with code [${judgeCode}] cannot vote country with code [${countryCode}] as its voting status is not [OPEN].`;
            res.status(409).json(new ServerErrorResponse(code, description));
            return;
        }

        let voteRecord = votingSchema.voteModel.records.findByPrimaryKey(countryCode, judgeCode);

        if (voteRecord != null) {
            prevPoints = voteRecord.getValue("points");
        }

        if (prevPoints == points) {
            // No Update
            res.status(204).send();
            return;
        }

        // Check policy

        if (judgeRecord.getValue("policyCode") != "null") {
            let mapper = judgeRecord.getProperty("VotesMapper");

            if (mapper == null) {
                mapper = VotesMapper.generate(judgeRecord);
                judgeRecord.addProperty("VotesMapper", mapper);
            }
            
            let applier = new PolicyApplier(judgeRecord, mapper);
            applier.apply(prevPoints, points);

            if (!applier.success) {
                let code = "JUDGE_POLICY_UNFULFILLED_ERROR";
                res.status(409).json(new ServerErrorResponse(code, applier.errorMessage));
                return;
            }
        }

        // Update vote

        if (voteRecord == null) {
            voteRecord = votingSchema.voteModel.pushNewRecord(countryCode, judgeCode, points);
        }
        else {
            voteRecord.setValue("points", points);
        }

        voteRecord.saveAndApplyChanges().then(result => {
            if (result.success) {
                if (result.modifiedRecords != null) {
                    let parentRecord = voteRecord.getParentRecord(VotingSchema.FK_Country_Vote);
    
                    if (parentRecord != null) {
                        let totalVotes = parentRecord.getValue("totalVotes");
                        totalVotes += points - prevPoints;
                        parentRecord.setValue("totalVotes", totalVotes);
                        parentRecord.acceptChanges();
                    }

                    SocketIO.sendVote(judgeRecord, parentRecord, points);
                }

                res.status(204).send();
            }
            else {
                res.status(409).json(ServerErrorResponse.createDefUpdateError(result.errorDescription, votingSchema.voteModel.modelName, countryCode, judgeCode));
            }
        })
        .catch((e) => {res.status(500).json(ServerErrorResponse.createServerError(e.message))});
    }
    catch(e) {
        res.status(409).json(ServerErrorResponse.handleUpdateError(e, votingSchema.voteModel.modelName, countryCode, judgeCode));
    }
}

module.exports.deleteVote = (req, res, next) => {
    let countryCode = req.params.countryCode;
    let judgeCode = req.params.judgeCode;

    ControllerUtils.deleteRecord(req, res, votingSchema.voteModel, countryCode, judgeCode);
}