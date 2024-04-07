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

let isCountriesInitialized = false;

CountriesCache.initCountries = async function() {

    countries = await CountryRequests.getAllCountries()
    .then(response => {
        if (response.success) {
            CountriesCache.fillCountries(response.data.countries);

            return countries;
        }
        else return [];
    });

    return countries;
}

CountriesCache.setCountries = function(countriesData) {
    if (countries.length == countriesData.length) return;

    countries = [];

    CountriesCache.fillCountries(countriesData);
}

CountriesCache.updateCountry = function(code, updatedData) {
    let countryIndex = countries.findIndex(element => element.code == code);

    if (countryIndex < 0) return;
    let country = country[countryIndex];
    country = _.extend(country, updatedData);
    countries[countryIndex] = country;
}

CountriesCache.findCountryByRunningOrder = function(runningOrder) {
    let country = countries.find(element => _.parseInt(element.runningOrder) == _.parseInt(runningOrder));
    
    if (country == null) return null;
    else return country;
}

CountriesCache.findCountryCodeByRunningOrder = function(runningOrder) {
    let country = CountriesCache.findCountryByRunningOrder(runningOrder);
    
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
        // TODO: merge voting statuses with country
        countries.push(country);
    });
    isCountriesInitialized = true;
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

CountriesCache.clearCountries = function() {
    countries = [];
    isCountriesInitialized = false;
}

CountriesCache.isInitialized = function() {
    return isCountriesInitialized;
}

//#endregion

// #region Judges

let isJudgesInitialized = false;

JudgesCache.initJudges = async function() {
        judges = await JudgeRequests.getAllJudges()
        .then(response => {
            if (response.success) {
                JudgesCache.fillJudges(response.data.judges);

                return judges;
            }
            else return [];
        });

        return judges;
}

JudgesCache.getJudges = function() {
    return judges;
}

JudgesCache.setJudges = function(judgesData) {
    if (judges.length == judgesData.length) return;

    clearJudges();

    JudgesCache.fillJudges(judgesData);
}

JudgesCache.updateJudge = function(code, updatedData) {
    let judgeIndex = judges.findIndex(element => element.code == code);

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
    let onlineJudges = Array.from(socketMapping.values());

    data.forEach(judge => {
        let isOnline = false;
        if (onlineJudges.includes(judge.code)) isOnline = true;
        judge.online = isOnline;

        judges.push(judge);
    });

    isJudgesInitialized = true;
}

JudgesCache.resetJudges = function() {
    clearJudges();
    return JudgesCache.initJudges();
}

function clearJudges() {
    judges = [];
    isJudgesInitialized = false;
}

JudgesCache.isInitialized = function() {
    return isJudgesInitialized;
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
    JudgesCache.updateJudge(judgeCode, judgeData);
    console.log(socketMapping)
}

SocketMappingCache.removeSocketID = function(socketID) {
    let judgeCode = socketMapping.get(socketID);

    let judgeData = {online : false};
    JudgesCache.updateJudge(judgeCode, judgeData);

    socketMapping.delete(socketID);
    console.log(socketMapping);
}

SocketMappingCache.getOnlineJudgeCodes = function() {
    return Array.from(socketMapping.values());
}

//#endregion

module.exports = {
    RunningCountryCache,
    CountriesCache,
    JudgesCache,
    VotingStatusesCache,
    SocketMappingCache
};