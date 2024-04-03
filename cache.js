const _ = require("lodash");
const { JudgeRequests } = require("./requests/judgeRequests");
const { CountryRequests } = require("./requests/countryRequests");

//#region Namespaces

var RunningCountryCache = {};
var CountriesCache = {};
var JudgesCache = {};
var VotingStatusesCache = {};
var SocketMappingCache = {};

//#endregion

//#region Variables

let runningCountry = 0;
let countries = [];
let judges = [];
let votingStatuses = [];
let socketMapping = new Map();

//#endregion

//#region Running Country

RunningCountryCache.setRunningCountry = function(value) {
    runningCountry = value;
}

RunningCountryCache.getRunningCountry = function() {
    return runningCountry;
}

RunningCountryCache.getRunningCountryCode = function() {
    return CountriesCache.findCountryCodeByRunningOrder(runningCountry);
}

RunningCountryCache.resetRunningCountry = function() {
    runningCountry = 0;
}

//#endregion

//#region Countries

CountriesCache.initCountries = function() {
    if (countries.length == 0) {
        CountryRequests.getAllCountries()
        .then(response => {
            if (response.success) {
                CountriesCache.fillCountries(response.data.countries)
            }
        })
    }
}

CountriesCache.setCountries = function(countriesData) {
    if (countries.length == countriesData.length) return;

    countries = [];

    CountriesCache.fillCountries(countriesData);
}

CountriesCache.findCountryCodeByRunningOrder = function(runningOrder) {
    let country = countries.find(element => _.parseInt(element.runningOrder) == _.parseInt(runningOrder));
    
    if (country == null) return null;
    else return country.code;
}

CountriesCache.findCountryNameByCode = function(code) {
    let country = countries.find(element => element.code == code);

    if (country == null) return null;
    else return country.name;
}

CountriesCache.fillCountries = function(data) {
    data.forEach(country => {
        countries.push({runningOrder : country.runningOrder, code : country.code, name : country.name, votes : country.votes, totalVotes : country.totalVotes});
    });
}

CountriesCache.setVotes = function(judgeCode, countryCode, points) {
    let country = countries.find(element => element.code == countryCode);

    if (country == null) return;
    else {
        let preUpdatedPoints = 0;
        let preUpdatedTotalVotes = country.totalVotes;

        if (country.votes[judgeCode] != null) {
            preUpdatedPoints = country.votes[judgeCode];
        }
        country.votes[judgeCode] = points;
        country.totalVotes = preUpdatedTotalVotes + points - preUpdatedPoints;
    }
}

CountriesCache.getTotalVotes = function(countryCode) {
    let country = countries.find(element => element.code == countryCode);

    if (country == null) return 0;
    else return country.totalVotes;
}

CountriesCache.resetCountries = function() {
    countries = [];
    CountriesCache.initCountries();
}

//#endregion

// #region Judges

JudgesCache.initJudges = function() {
    if (judges.length == 0) {
        JudgeRequests.getAllJudges()
        .then(response => {
            if (response.success) {
                JudgesCache.fillJudges(response.data.judges);
            }
        })
    }
}

JudgesCache.setJudges = function(judgesData) {
    if (judges.length == judgesData.length) return;

    judges = [];

    JudgesCache.fillJudges(judgesData);
}

JudgesCache.updateJudgesEntry = function(judgeCode, updatedData) {
    let judgeIndex = judges.findIndex(element => element.code == judgeCode);

    if (judgeIndex < 0) return;
    let judge = judges[judgeIndex];
    judge = _.extend(judge, updatedData);
    judges[judgeIndex] = judge;
}

JudgesCache.findJudgeNameByCode = function(code) {
    let judge = judges.find(element => element.code == code);
    
    if (judge == null) return null;
    else return judge.name;
}

JudgesCache.fillJudges = function(data) {
    data.forEach(judge => {
        judges.push({code : judge.code, name : judge.name, online : false});
    });
}

JudgesCache.resetJudges = function() {
    judges = [];
    JudgesCache.initJudges();
}

// #endregion

//#region Voting Statuses

VotingStatusesCache.setVotingStatuses = function(countryCodes, status) {
    countryCodes.forEach(countryCode => {
        let i = votingStatuses.findIndex(element => element.countryCode == countryCode);
    
        if (i > -1) votingStatuses[i].status = status;
        else votingStatuses.push({countryCode : countryCode, status : status});
    });
}

VotingStatusesCache.getVotingStatusByCountryCode = function(countryCode) {
    if (countryCode == null) return "CLOSED";

    let votingStatus = votingStatuses.find(element => element.countryCode == countryCode);

    if (votingStatus == null) return "CLOSED";
    else return votingStatus.status;
}

VotingStatusesCache.getVotingStatusByRunningOrder = function(runningOrder) {
    let countryCode = CountriesCache.findCountryCodeByRunningOrder(runningOrder);
    return VotingStatusesCache.getVotingStatusByCountryCode(countryCode);
}

VotingStatusesCache.getVotingStatuses = function() {
    return votingStatuses;
}

VotingStatusesCache.resetVotingStatuses = function() {
    votingStatuses = [];
}

//#endregion

//#region 

SocketMappingCache.addSocketID = function(socketID, judgeCode) {
    socketMapping.set(socketID, judgeCode);
    
    let judgeData = {online : true};
    JudgesCache.updateJudgesEntry(judgeCode, judgeData);
    console.log(socketMapping)
}

SocketMappingCache.removeSocketID = function(socketID) {
    let judgeCode = socketMapping.get(socketID);

    let judgeData = {online : false};
    JudgesCache.updateJudgesEntry(judgeCode, judgeData);

    socketMapping.delete(socketID);
    console.log(socketMapping);
}

//#endregion

module.exports = {
    RunningCountryCache,
    CountriesCache,
    JudgesCache,
    VotingStatusesCache,
    SocketMappingCache
};