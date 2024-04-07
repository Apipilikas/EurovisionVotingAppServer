const { RunningCountryCache, VotingStatusesCache, JudgesCache, CountriesCache, SocketMappingCache } = require("../cache");


module.exports.resetRunningCountry = (req, res, next) => {
    RunningCountryCache.resetRunningCountry();
    res.status(200);
}

module.exports.resetVotingStatusCache = (req, res, next) => {
    VotingStatusesCache.resetVotingStatuses();
    res.status(200);
}

module.exports.resetJudgesCache = (req, res, next) => {
    JudgesCache.resetJudges();
    res.status(200);
}

module.exports.resetCountriesCache = (req, res, next) => {
    CountriesCache.resetCountries();
    res.status(200);
}

module.exports.resetAllCaches = (req, res, next) => {
    VotingStatusesCache.resetVotingStatuses();
    JudgesCache.resetJudges();
    CountriesCache.resetCountries();
    res.status(200);
}

module.exports.getAllOnlineJudges = (req, res, next) => {
    let onlineJudgeCodes = SocketMappingCache.getOnlineJudgeCodes();
    res.status(200).json({judges : onlineJudgeCodes});
}