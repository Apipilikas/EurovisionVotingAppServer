const _ = require("lodash");

var CacheUtils = {};

CacheUtils.addEntry = function(array, entry) {
    try {
        array.push(entry);
    }
    catch {
        return false;
    }

    return true;
}

CacheUtils.findEntry = function(array, id, filter) {
    return array.find(element => element[filter] == id);
}

CacheUtils.findEntryIndex = function(array, id, filter) {
    return array.findIndex(element => element[filter] == id);
}

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

CacheUtils.deleteEntry = function(array, id, filter) {
    let index = CacheUtils.findEntryIndex(array, id, filter);

    if (index < 0) return null;
    let deletedEntry = array.splice(index, 1);
    return deletedEntry;
}

module.exports = {CacheUtils};