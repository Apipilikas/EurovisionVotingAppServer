var util = require('util');

/**
 * This class is used for the communication between DB and Server.
 */
class DAOResponse {
    /**
     * DAOResponse contructor
     * @param {boolean} success The action result. True if action was executed successfully. Otherwise, false.
     * @param {object} data The received data
     * @param {string} errorCode The error code assigned to this specific case.
     */
    constructor(success, data, errorCode) {
        this.success = success;
        this.data = data;
        this.errorCode = errorCode;
    }

    /**
     * Creates a successful response.
     * @param {object} data 
     * @returns {DAOResponse}
     */
    static createSuccessfulResponse(data = null) {
        return new DAOResponse(true, data, null);
    }

    /**
     * Creates a failure response.
     * @param {string} errorCode  
     * @returns {DAOResponse}
     */
    static createFailedResponse(errorCode) {
        return new DAOResponse(false, null, errorCode);
    }
}

/**
 * This class is used for the communication between Server and Client.
 */
class ErrorResponse {
    static ErrorMapping = new Map([
        ["DEFAULT_MESSAGE", "A problem has been occurred while trying to modify a %s"],
        ["SERVER_ERROR", "An internal error has been occurred while trying to fullfil a request. Error details: %s"],
        ["CANNOT_GET_ALL_RECORDS", "A problem has been occurred while fetching all %s."],
        ["CANNOT_GET_SPECIFIC_RECORD", "A problem has been occurred while fetching %s with code [%s]."],
        ["RECORD_ALREADY_EXISTS", "%s with code [%s] already exists."],
        ["NO_RECORD_INSERTED", "%s with code [%s] has not been inserted."],
        ["CANNOT_INSERT_RECORD", "A problem has been occurred while inserting a %s with code [%s]."],
        ["NO_RECORD_UPDATED", "%s with code [%s] has not been updated as it does not exist."],
        ["CANNOT_UPDATE_RECORD", "A problem has been occurred while updating a %s with code [%s]."],
        ["NO_RECORD_DELETED", "%s with code %s has not been deleted as it has been already deleted or it does not exist."],
        ["CANNOT_DELETE_RECORD", "A problem has been occurred while deleting %s with code [%s]."],
        ["JUDGE_PERMISSION_DENIED", "%s with code [%s] has no permission to execute this action."],
        ["NO_JUDGE_CREDENTIALS_FOUND", "No authorization token found on headers request."],
        ["CANNOT_VOTE_ORIGIN_COUNTRY", "%s with code [%s] cannot vote ones origin country."]
    ]
    );

    /**
     * ErrorResponse constructor
     * @param {string} code The error code
     * @param {description} description The error description
     */
    constructor (code, description) {
        this.code = code;
        this.description = description;
    }

    /**
     * Creates an ErrorResponse instance. Based on error code (map key), error description associated with this specific code is fetched.
     * @param {string} errorCode 
     * @param {string} collectionName 
     * @param  {...string} params 
     * @returns {ErrorResponse}
     */
    static create(errorCode, collectionName, ...params) {
        let errorDescription =  util.format(this.ErrorMapping.get(errorCode), collectionName, ...params);
        
        return new ErrorResponse(errorCode, errorDescription);
    }

    /**
     * Creates a Server ErrorResponse.
     * @param {string} errorMessage The error message
     * @returns 
     */
    static createServerErrorResponse(errorMessage) {
        return this.create("SERVER_ERROR", null, errorMessage);
    }

    toJSON() {
        return {error : {code : this.code, description : this.description}};
    }
}

/**
 * This class is used for the communication between the two sides of the socket.
 */
class SocketIOResponse {
    /**
     * SocketIOResponse constructor
     * @param {object} data The sent data
     * @param {object} message The socketio message
     * @param {boolean} hasMultipleMessages True if has multiple messages. Otherwise, if it has only one returs false.
     */
    constructor(data, message, hasMultipleMessages = false) {
        this.data = data;
        this.message = message;
        this.hasMultipleMessages = hasMultipleMessages;
    }

    /**
     * Creates a SocketIOResponse instance. Message will be formatted based on the params.
     * @param {object} data The sent data
     * @param {string} message The unformatted message
     * @param  {...string} params The params that will replace the message.
     * @returns {SocketIOResponse}
     */
    static create(data, message, ...params) {
        let socketIOMessage = this.createMessage(message, ...params);

        let response = new SocketIOResponse(data, socketIOMessage.toJSON());
        return response;
    }

    /**
     * Creates just the message.
     * @param {string} message The unformatted message
     * @param  {...string} params The params that will replace the message.
     * @returns {SocketIOMessage}
     */
    static createMessage(message, ...params) {
        let plainText = util.format(message, ...params);
        params = params.map((param, index) => {
            return util.format('<span class"prm-%s">%s</span>', index, param);
        });
        let htmlText = util.format(message, ...params);

        return new SocketIOMessage(plainText, htmlText);
    }

    /**
     * Converts the object to json.
     * @returns {object}
     */
    toJSON() {
        let messageCaption = this.hasMultipleMessages ? "messages" : "message"; 
        return {data : this.data, [messageCaption] : this.message};
    }
}

/**
 * This class supports the SocketIOResponse.
 */
class SocketIOMessage {
    /**
     * SocketIOMessage constructor
     * @param {string} plainText 
     * @param {string} htmlText 
     */
    constructor(plainText, htmlText) {
        this.plainText = plainText;
        this.htmlText = htmlText;
    }

    /**
     * Converts the object to json.
     * @returns {object}
     */
    toJSON() {
        return {plainText : this.plainText, htmlText : this.htmlText};
    }
}

module.exports = {DAOResponse, ErrorResponse, SocketIOResponse};