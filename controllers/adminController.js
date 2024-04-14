const { RunningCountryCache, VotingStatusesCache, JudgesCache, CountriesCache, SocketMappingCache } = require("../cache");


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
    });
}

module.exports.resetCountriesCache = (req, res, next) => {
    CountriesCache.resetCountries()
    .then(response => {
        if (response) {
            res.status(200).send();
        }
    })
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