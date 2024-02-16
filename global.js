const { getAllJudges } = require("./requests/judgeRequests");

let runningCountry = 0;
let countries = [];
let votingStatuses = [];

//#region Running Country

function setRunningCountry(value) {
    runningCountry = value;
}

function getRunningCountry() {
    return runningCountry;
}

function getRunningCountryCode() {
    return findCountryCodeByRunningOrder(runningCountry);
}

//#endregion

//#region Countries

function initCountries() {
    if (countries.length == 0) {
        getAllJudges()
        .then(response => {
            if (response.success) {
                
                fillCountries(response.data.countries)
            }
        })
    }
}

function setCountries(countriesData) {
    if (countries.length == countriesData.length) return;

    countries = [];

    fillCountries(countriesData);
}

function findCountryCodeByRunningOrder(runningOrder) {
    let country = countries.find(element => element.runningOrder == runningOrder);

    if (country == null) return null;
    else return country.code;
}

function fillCountries(data) {
    data.forEach(country => {
        countries.push({runningOrder : country.runningOrder, code : country.code});
    });
}

//#endregion

//#region Voting Statuses

function setVotingStatuses(countryCodes, status) {
    countryCodes.forEach(countryCode => {
        let i = votingStatuses.findIndex(element => element.countryCode == countryCode);
    
        if (i > -1) votingStatuses[i].status = status;
        else votingStatuses.push({countryCode : countryCode, status : status});
    });
}

function getVotingStatusByCountryCode(countryCode) {
    if (countryCode == null) return "CLOSED";

    let votingStatus = votingStatuses.find(element => element.countryCode == countryCode);

    if (votingStatus == null) return "CLOSED";
    else return votingStatus.status;
}

function getVotingStatusByRunningOrder(runningOrder) {
    let countryCode = findCountryCodeByRunningOrder(runningOrder);
    return getVotingStatusByCountryCode(countryCode);
}

function getVotingStatuses() {
    return votingStatuses;
}

//#endregion

module.exports = {
    setRunningCountry,
    getRunningCountry,
    getRunningCountryCode,
    setCountries,
    findCountryCodeByRunningOrder,
    setVotingStatuses,
    getVotingStatusByCountryCode,
    getVotingStatusByRunningOrder,
    getVotingStatuses
};