const { RunningCountryCache, VotingStatusesCache, JudgesCache, CountriesCache, SocketMappingCache } = require("../cache");
const { ErrorResponse } = require("../utils/responses");


module.exports.resetRunningCountry = (req, res, next) => {
    RunningCountryCache.resetRunningCountry();
    res.status(200).send();
}

module.exports.resetVotingStatusCache = (req, res, next) => {
    VotingStatusesCache.resetVotingStatuses();
    res.status(200).send();
}

module.exports.resetJudgesCache = (req, res, next) => {
    JudgesCache.resetJudges()
    .then(response => {
        if (response) {
            res.status(200).send();
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
}

module.exports.resetCountriesCache = (req, res, next) => {
    CountriesCache.resetCountries()
    .then(response => {
        if (response) {
            res.status(200).send();
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
}

module.exports.resetAllCaches = async (req, res, next) => {
    VotingStatusesCache.resetVotingStatuses();
    let judgesResponse = await JudgesCache.resetJudges();
    let countriesResponse = await CountriesCache.resetCountries();
    
    if (judgesResponse && countriesResponse) {
        res.status(200).send();
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