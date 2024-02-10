let runningCountry = 0;
let votingStatuses = [];

function setRunningCountry(value) {
    runningCountry = value;
}

function getRunningCountry() {
    return runningCountry;
}

function setVotingStatuses(countryCodes, status) {
    countryCodes.forEach(countryCode => {
        let i = votingStatuses.findIndex(element => element.countryCode == countryCode);
    
        if (i > -1) votingStatuses[i].status = status;
        else votingStatuses.push({countryCode : countryCode, status : status});
    });
}

function getVotingStatusByCountryCode(countryCode) {
    let votingStatus = votingStatuses.find(element => element.countryCode == countryCode);

    if (votingStatus == null) return "CLOSED";
    else return votingStatus.status;
}

function getVotingStatuses() {
    return votingStatuses;
}

module.exports = {
    setRunningCountry,
    getRunningCountry,
    setVotingStatuses,
    getVotingStatusByCountryCode,
    getVotingStatuses
};