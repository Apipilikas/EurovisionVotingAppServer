const _ = require("lodash");

var CacheUtils = {};

/**
 * Adds a new entry to array.
 * @param {object[]} array 
 * @param {object} entry 
 * @returns {boolean} True if addition was completed successfully. Otherwise, false.
 */
CacheUtils.addEntry = function(array, entry) {
    try {
        array.push(entry);
    }
    catch {
        return false;
    }

    return true;
}

/**
 * Gets the first entry found whose id matches the given filter.
 * @param {object[]} array 
 * @param {string} id 
 * @param {string} filter The object property name that will match with the id.
 * @returns {object} The found entry. If entry was not found, returns null.
 */
CacheUtils.findEntry = function(array, id, filter) {
    return array.find(element => element[filter] == id);
}

/**
 * Gets the index of the first entry found whose id matches the given filter.
 * @param {object[]} array 
 * @param {string} id 
 * @param {string} filter The object property name that will match with the id.
 * @returns {number} Entry index
 */
CacheUtils.findEntryIndex = function(array, id, filter) {
    return array.findIndex(element => element[filter] == id);
}

/**
 * Updates the first entry found whose id matches the given filter.
 * @param {object[]} array 
 * @param {string} id 
 * @param {string} filter The object property name that will match with the id.
 * @param {object} updatedEntry Updated entry's data
 * @returns {boolean} True if update was successfull. Otherwise, false.
 */
CacheUtils.updateEntry = function(array, id, filter, updatedEntry) {
    let index = CacheUtils.findEntryIndex(array, id, filter);
    
    if (index < 0) return false;
    try {
        let entry = array[index];
        entry = _.extend(entry, updatedEntry);
        array[index] = entry;
    }
    catch {
        return false;
    }

    return true;
}

/**
 * Deletes entry whose id matches the given filter.
 * @param {object[]} array 
 * @param {string} id 
 * @param {string} filter 
 * @returns {object} The deleted entry. If entry was not found, returns null.
 */
CacheUtils.deleteEntry = function(array, id, filter) {
    let index = CacheUtils.findEntryIndex(array, id, filter);

    if (index < 0) return null;
    let deletedEntry = array.splice(index, 1);
    return deletedEntry;
}

module.exports = {CacheUtils};