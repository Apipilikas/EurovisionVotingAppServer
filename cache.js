const { parseInt } = require("lodash");
const { getAllJudges } = require("./requests/judgeRequests");

let runningCountry = 0;
let countries = [];
let judges = [];
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

function resetRunningCountry() {
    runningCountry = 0;
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
    let country = countries.find(element => parseInt(element.runningOrder) == parseInt(runningOrder));
    
    if (country == null) return null;
    else return country.code;
}

function findCountryNameByCode(code) {
    let country = countries.find(element => element.code == code);

    if (country == null) return null;
    else return country.name;
}

function fillCountries(data) {
    data.forEach(country => {
        countries.push({runningOrder : country.runningOrder, code : country.code, name : country.name, votes : country.votes, totalVotes : country.totalVotes});
    });
}

function setVotes(judgeCode, countryCode, points) {
    let country = countries.find(element => element.code == countryCode);

    if (country == null) return;
    else {
        let preUpdatedPoints = 0;
        let preUpdateTotalVotes = country.totalVotes;

        if (country.votes[judgeCode] != null) {
            preUpdatedPoints = country.votes[judgeCode];
        }
        country.votes[judgeCode] = points;
        country.totalVotes = preUpdateTotalVotes + points - preUpdatedPoints;
    }
}

function getTotalVotes(countryCode) {
    let country = countries.find(element => element.code == countryCode);

    if (country == null) return 0;
    else return country.totalVotes;
}

function resetCountries() {
    countries = [];
    initCountries();
}

//#endregion

// #region Judges

function initJudges() {
    if (judges.length == 0) {
        getAllJudges()
        .then(response => {
            if (response.success) {
                fillJudges();
            }
        })
    }
}

function setJudges(judgesData) {
    if (judges.length == judgesData.length) return;

    judges = [];

    fillJudges(judgesData);
}

function findJudgeNameByCode(code) {
    let judge = judges.find(element => element.code == code);
    
    if (judge == null) return null;
    else return judge.name;
}

function fillJudges(data) {
    data.forEach(judge => {
        judges.push({code : judge.code, name : judge.name});
    });
}

function resetJudges() {
    judges = [];
    initJudges();
}

// #endregion

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

function resetVotingStatuses() {
    votingStatuses = [];
}

//#endregion

module.exports = {
    setRunningCountry,
    getRunningCountry,
    getRunningCountryCode,
    resetRunningCountry,
    getTotalVotes,
    setCountries,
    resetCountries,
    setVotes,
    findCountryCodeByRunningOrder,
    findCountryNameByCode,
    setJudges,
    resetJudges,
    findJudgeNameByCode,
    setVotingStatuses,
    getVotingStatusByCountryCode,
    getVotingStatusByRunningOrder,
    getVotingStatuses,
    resetVotingStatuses
};