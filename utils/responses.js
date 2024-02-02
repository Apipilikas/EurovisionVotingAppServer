var util = require('util');

class DAOResponse {
    constructor(success, data, errorCode) {
        this.success = success;
        this.data = data;
        this.errorCode = errorCode;
    }

    static createSuccessfulResponse(data = null) {
        return new DAOResponse(true, data, null);
    }

    static createFailedResponse(errorCode) {
        return new DAOResponse(false, null, errorCode);
    }
}

class ErrorResponse {
    static ErrorMapping = new Map([
        ["CANNOT_GET_ALL_RECORDS", "A problem occured while fetching all %s."],
        ["CANNOT_GET_SPECIFIC_RECORD", "A problem occured while fetching %s with codes %s."],
        ["RECORD_ALREADY_EXISTS", "%s with code %s already exists."],
        ["NO_RECORD_INSERTED", "%s with code %s has not been inserted."],
        ["CANNOT_INSERT_RECORD", "A problem occured while inserting %s with code %s"],
        ["NO_RECORD_UPDATED", "%s with code %s has not been updated as it does not exist."],
        ["CANNOT_UPDATE_RECORD", "A problem occured while updating %s with code %s"],
        ["NO_RECORD_DELETED", "%s with code %s has not been deleted as it has been already deleted or it does not exist."],
        ["CANNOT_DELETE_RECORD", "A problem occured while deleting %s with code %s"]
    ]
    );

    constructor (code, description) {
        this.code = code;
        this.description = description;
    }

    static createResponse(errorCode, collectionName, value) {
        let errorDescription =  util.format(this.ErrorMapping.get(errorCode), collectionName, value);
        
        return new ErrorResponse(errorCode, errorDescription);
    }

    toJSON() {
        return {error : {code : this.code, description : this.description}};
    }
}

module.exports = {DAOResponse, ErrorResponse};