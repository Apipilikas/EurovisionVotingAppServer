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
        ["CANNOT_GET_ALL_RECORDS", "A problem occured while fetching all {0}."],
        ["CANNOT_GET_SPECIFIC_RECORD", "A problem occured while fetching {0} with codes {1}."],
        ["RECORD_ALREADY_EXISTS", "{0} with code {0} already exists."],
        ["NO_RECORD_INSERTED", "{0} with code {1} has not been inserted."],
        ["CANNOT_INSERT_RECORD", "A problem occured while inserting {0} with code {1}"],
        ["NO_RECORD_UPDATED", "{0} with code {1} has not been updated as it does not exist."],
        ["CANNOT_UPDATE_RECORD", "A problem occured while updating {0} with code {1}"],
        ["NO_RECORD_DELETED", "{0} with code {1} has not been deleted as it has been already deleted or it does not exist."],
        ["CANNOT_DELETE_RECORD", "A problem occured while deleting {0} with code {1}"]
    ]
    );

    constructor (code, description) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) { 
              return typeof args[number] != 'undefined'
                ? args[number]
                : match
              ;
            });
          };
        
        this.code = code;
        this.description = description;
    }

    static createErrorResponse(errorCode, collectionName, insertedValue) {
        let errorDescription = this.ErrorMapping.get(errorCode).format(collectionName, insertedValue);

        return new ErrorResponse(errorCode, errorDescription);
    }
}

module.exports = {DAOResponse, ErrorResponse};