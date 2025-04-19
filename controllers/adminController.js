const { CountriesCache, SocketMappingCache } = require("../cache");
const { votingSchema } = require("../schemas/votingSchema");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");


module.exports.resetRunningCountry = (req, res, next) => {
    try {
        votingSchema.runningCountry = 0;
        res.status(204).send();
    }
    catch(e) {
        res.status(500).json(ServerErrorResponse.createServerError(e.message));
    }
}

module.exports.resetVotingStatus = (req, res, next) => {
    try {
        for (let record of votingSchema.countryModel.records) {
            record.setValue("votingStatus", votingSchema.countryModel.votingStatusField.defaultValue);
            record.acceptChanges();
        }
        res.status(204).send();
    }
    catch(e) {
        res.status(500).json(ServerErrorResponse.createServerError(e.message));
    }
}

module.exports.resetAllCaches = async (req, res, next) => {
    try {
        votingSchema.clearData();
        await votingSchema.fetchData();

        res.status(204).send();
    }
    catch(e) {
        res.status(500).json(ServerErrorResponse.createServerError(e.message));
    }
}

module.exports.getAllOnlineJudges = (req, res, next) => {
    let onlineJudgeCodes = SocketMappingCache.getOnlineJudgeCodes();
    res.status(200).json({judges : onlineJudgeCodes});
}

module.exports.setWinnerCountry = (req, res, next) => {
    let code = req.body.code;
    CountriesCache.setWinnerCountry(code);
    res.status(200).send();
}

module.exports.clearWinnerCountry = (req, res, next) => {
    CountriesCache.clearWinnerCountry();
    res.status(200).send();
}