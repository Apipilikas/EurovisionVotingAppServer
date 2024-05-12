const _ = require("lodash");
const { JudgeRequests } = require("./requests/judgeRequests");
const { CountryRequests } = require("./requests/countryRequests");
const { CacheUtils } = require("./utils/cacheUtils");

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
let winnerCountry = null;
let judges = [];
let votingStatuses = [];
let socketMapping = new Map();

//#endregion

//#region Running Country

/**
 * Sets running country's order.
 * @param {number} value 
 */
RunningCountryCache.setRunningCountry = function(value) {
    runningCountry = value;
}

/**
 * Gets running country's order.
 * @returns {number} Running country order
 */
RunningCountryCache.getRunningCountry = function() {
    return runningCountry;
}

/**
 * Gets running country's code.
 * @returns {string} Country's code
 */
RunningCountryCache.getRunningCountryCode = function() {
    return CountriesCache.findCountryCodeByRunningOrder(runningCountry);
}

/**
 * Resets running country's order.
 */
RunningCountryCache.resetRunningCountry = function() {
    runningCountry = 0;
}

//#endregion

//#region Countries

let isCountriesInitialized = false;

/**
 * Initializes countries cache.
 * @returns {Promise<boolean>} A promise with result true if initialization was completed successfully. Otherwise false.
 */
CountriesCache.initCountries = async function() {

    return CountryRequests.getAllCountriesSortedByRunningOrder()
    .then(response => {
        if (response.success) {
            CountriesCache.fillCountries(response.data);
            return true;
        }
        else return false;
    })
    .catch(e => {return false});
}

/**
 * Gets countries.
 * @returns {object[]} An array of the countries.
 */
CountriesCache.getCountries = function() {
    return countries;
}

/**
 * Sets countries.
 * @param {object[]} countriesData 
 */
CountriesCache.setCountries = function(countriesData) {
    if (countries.length == countriesData.length) return;

    countries = [];

    CountriesCache.fillCountries(countriesData);
}

/**
 * Adds a new country to array.
 * @param {object} country The new country object.
 * @returns {boolean} True if addition was completed successfully. Otherwise, false.
 */
CountriesCache.addCountry = function(country) {
    return CacheUtils.addEntry(countries, country);
}

/**
 * Updates an existing country.
 * @param {string} code Country's code
 * @param {object} updatedCountry Updated country's data
 * @returns {boolean} True if update was completed successfully. Otherwise, false.
 */
CountriesCache.updateCountry = function(code, updatedCountry) {
    return CacheUtils.updateEntry(countries, code, "code", updatedCountry);
}

/**
 * Gets country that matches the given running order.
 * @param {number} runningOrder The running order 
 * @returns {object} A country object. If country was not found, returns null.
 */
CountriesCache.findCountryByRunningOrder = function(runningOrder) {
    let country = countries.find(element => _.parseInt(element.runningOrder) == _.parseInt(runningOrder));
    
    if (country == null) return null;
    else return country;
}

/**
 * Gets country code that matches the given running order.
 * @param {number} runningOrder The running order
 * @returns {string} The code of the country. If country was not found, returns null.
 */
CountriesCache.findCountryCodeByRunningOrder = function(runningOrder) {
    let country = CountriesCache.findCountryByRunningOrder(runningOrder);
    
    if (country == null) return null;
    else return country.code;
}

/**
 * Gets country that matches the given code.
 * @param {string} code Country's code
 * @returns {object} A country object. If country was not found, returns null.
 */
CountriesCache.findCountry = function(code) {
    return CacheUtils.findEntry(countries, code, "code");
}

/**
 * Gets country's name that matches the given code.
 * @param {string} code Country's code
 * @returns {object} A country object. If country was not found, returns null.
 */
CountriesCache.findCountryNameByCode = function(code) {
    let country = CountriesCache.findCountry(code);

    if (country == null) return null;
    else return country.name;
}

/**
 * Fills country array.
 * @param {object[]} data 
 */
CountriesCache.fillCountries = function(data) {
    data.forEach(country => {
        // TODO: merge voting statuses with country
        CacheUtils.addEntry(countries, country);
    });
    isCountriesInitialized = true;
}

/**
 * Sets vote to a specific country for a specific judge.
 * @param {string} judgeCode Judge who voted
 * @param {string} countryCode Country that judge voted
 * @param {number} points 
 */
CountriesCache.setVotes = function(judgeCode, countryCode, points) {
    let country = CountriesCache.findCountry(countryCode);

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

/**
 * Gets country's total votes.
 * @param {string} code 
 * @returns {number} Country's total votes. If country was not found, returns 0.
 */
CountriesCache.getTotalVotes = function(code) {
    let country = CountriesCache.findCountry(code);
    
    if (country == null) return 0;
    else return country.totalVotes;
}

/**
 * Resets countries cache meaning clearing out cache and initializing it.
 * @returns {Promise<boolean>} A promise with result true if initialization was completed successfully. Otherwise false.
 */
CountriesCache.resetCountries = function() {
    countries = [];
    return CountriesCache.initCountries();
}

/**
 * Deletes a country.
 * @param {string} code Country's code
 * @returns {object} The deleted country. If country was not found, returns null.
 */
CountriesCache.deleteCountry = function(code) {
    return CacheUtils.deleteEntry(countries, code, "code");
}

/**
 * Clears out countries cache.
 */
CountriesCache.clearCountries = function() {
    countries = [];
    isCountriesInitialized = false;
}

/**
 * Gets if countries cache has been initialized.
 * @returns {boolean} True if cache has been initialized. Otherwise, false.
 */
CountriesCache.isInitialized = function() {
    return isCountriesInitialized;
}

// Winner country

/**
 * Gets winner country.
 * @returns {object}
 */
CountriesCache.getWinnerCountry = function() {
    return winnerCountry;
}

/**
 * Sets winner country.
 * @param {string} countryCode Country's code 
 */
CountriesCache.setWinnerCountry = function(countryCode) {
    winnerCountry = CountriesCache.findCountry(countryCode);
}

/**
 * Clears out winner country.
 */
CountriesCache.clearWinnerCountry = function() {
    winnerCountry = null;
}

//#endregion

// #region Judges

let isJudgesInitialized = false;

/**
 * Initializes judges cache.
 * @returns {Promise<boolean>} A promise with result true if initialization was completed successfully. Otherwise false.
 */
JudgesCache.initJudges = async function() {
        return JudgeRequests.getAllJudges()
        .then(response => {
            if (response.success) {
                JudgesCache.fillJudges(response.data);
                return true;
            }
            else return false;
        })
        .catch(e => {return false});
}

/**
 * Gets judges.
 * @returns {object[]} An array of the judges.
 */
JudgesCache.getJudges = function() {
    return judges;
}

/**
 * Sets judges.
 * @param {object[]} judgesData 
 */
JudgesCache.setJudges = function(judgesData) {
    if (judges.length == judgesData.length) return;

    clearJudges();

    JudgesCache.fillJudges(judgesData);
}

/**
 * Adds a new judge to array.
 * @param {object} judge The new judge object. 
 * @returns {boolean} True if addition was completed successfully. Otherwise, false.
 */
JudgesCache.addJudge = function(judge) {
    return CacheUtils.addEntry(judges, judge);
}

/**
 * Updates an existing judge.
 * @param {string} code Judge's code
 * @param {object} updatedJudge Updated judge's data
 * @returns {boolean} True if update was completed successfully. Otherwise, false.
 */
JudgesCache.updateJudge = function(code, updatedJudge) {
    return CacheUtils.updateEntry(judges, code, "code", updatedJudge);
}

/**
 * Gets judge that matches the given code.
 * @param {string} code Judge's code
 * @returns {object} A judge object. If judge was not found, returns null.
 */
JudgesCache.findJudge = function(code) {
    return CacheUtils.findEntry(judges, code, "code");
}

/**
 * Gets judge's name that matches the given code.
 * @param {string} code Judge's code
 * @returns {object} A judge object. If judge was not found, returns null.
 */
JudgesCache.findJudgeNameByCode = function(code) {
    let judge = CacheUtils.findEntry(judges, code, "code");
    
    if (judge == null) return null;
    else return judge.name;
}

/**
 * Fills judge array. Given data are enriched with online/offline information.
 * @param {object[]} data 
 */
JudgesCache.fillJudges = function(data) {
    let onlineJudges = Array.from(socketMapping.values());

    data.forEach(judge => {
        let isOnline = false;
        if (onlineJudges.includes(judge.code)) isOnline = true;
        judge.online = isOnline;

        CacheUtils.addEntry(judges, judge);
    });

    isJudgesInitialized = true;
}

/**
 * Resets judges cache meaning clearing out cache and initializing it.
 * @returns 
 */
JudgesCache.resetJudges = function() {
    clearJudges();
    return JudgesCache.initJudges();
}

/**
 * Deletes a judge.
 * @param {string} code Judge's code
 * @returns {object} The deleted judge. If judge was not found, returns null.
 */
JudgesCache.deleteJudge = function(code) {
    return CacheUtils.deleteEntry(judges, code, "code");
}

/**
 * Clears out judges cache.
 */
function clearJudges() {
    judges = [];
    isJudgesInitialized = false;
}

/**
 * Gets if judges cache has been initialized.
 * @returns {boolean} True if cache has been initialized. Otherwise, false.
 */
JudgesCache.isInitialized = function() {
    return isJudgesInitialized;
}

// #endregion

//#region Voting Statuses

/**
 * Sets the voting status to countries. Object pushed in array has the following format:
 * {countryCode : countryCodeValue, status : statusValue}
 * @param {string[]} countryCodes Array of country codes
 * @param {boolean} status Voting status
 */
VotingStatusesCache.setVotingStatuses = function(countryCodes, status) {
    countryCodes.forEach(countryCode => {
        let i = CacheUtils.findEntryIndex(votingStatuses, countryCode, "countryCode");
    
        if (i >= 0) votingStatuses[i].status = status;
        else votingStatuses.push({countryCode : countryCode, status : status});
    });
}

/**
 * Gets voting status based on country code.
 * @param {string} countryCode 
 * @returns {string} OPEN if voting status is open for voting. Otherwise, returns CLOSED. If country code was not found in cache, returns CLOSED.
 */
VotingStatusesCache.getVotingStatusByCountryCode = function(countryCode) {
    if (countryCode == null) return "CLOSED";

    let votingStatus = CacheUtils.findEntry(votingStatuses, countryCode, "countryCode");
    
    if (votingStatus == null) return "CLOSED";
    else return votingStatus.status;
}

/**
 * Gets voting status based on running order.
 * @param {number} runningOrder 
 * @returns {string} OPEN if voting status is open for voting. Otherwise, returns CLOSED. If country code was not found in cache, returns CLOSED.
 */
VotingStatusesCache.getVotingStatusByRunningOrder = function(runningOrder) {
    let countryCode = CountriesCache.findCountryCodeByRunningOrder(runningOrder);
    return VotingStatusesCache.getVotingStatusByCountryCode(countryCode);
}

/**
 * Gets voting statuses cache.
 * @returns {object[]} An array of the voting statuses.
 */
VotingStatusesCache.getVotingStatuses = function() {
    return votingStatuses;
}

/**
 * Resets / Clears out voting statuses cache.
 */
VotingStatusesCache.resetVotingStatuses = function() {
    votingStatuses = [];
}

//#endregion

//#region 

/**
 * Adds a new socket ID. Socket mapping has key the socket ID and value the judge's code.
 * Adding a socket ID leads to updating the mapping judge with the online information.
 * @param {string} socketID Established socket ID
 * @param {string} judgeCode Judge's code
 */
SocketMappingCache.addSocketID = function(socketID, judgeCode) {
    socketMapping.set(socketID, judgeCode);
    
    let judgeData = {online : true};
    JudgesCache.updateJudge(judgeCode, judgeData);
    console.log(socketMapping)
}

/**
 * Removes socket ID. Removing a socket ID leads to updating the mapping Judge with the offline information.
 * @param {string} socketID Disconnected socket ID
 */
SocketMappingCache.removeSocketID = function(socketID) {
    let judgeCode = socketMapping.get(socketID);

    let judgeData = {online : false};
    JudgesCache.updateJudge(judgeCode, judgeData);

    socketMapping.delete(socketID);
    console.log(socketMapping);
}

/**
 * Gets online judge codes.
 * @returns {string[]} An array of the online judge codes.
 */
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