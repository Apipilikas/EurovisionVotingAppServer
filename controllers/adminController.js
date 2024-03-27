const { resetRunningCountry, resetVotingStatuses, resetJudges, resetCountries } = require("../cache")

module.exports.resetRunningCountry = (req, res, next) => {
    resetRunningCountry();
}

module.exports.resetVotingStatusCache = (req, res, next) => {
    resetVotingStatuses();
}

module.exports.resetJudgesCache = (req, res, next) => {
    resetJudges();
}

module.exports.resetCountriesCache = (req, res, next) => {
    resetCountries();
}

module.exports.resetAllCaches = (req, res, next) => {
    resetVotingStatuses();
    resetJudges();
    resetCountries();
}