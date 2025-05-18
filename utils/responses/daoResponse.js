/**
 * This class is used for the communication between DB and Server.
 */
class DAOResponse {
    /**
     * DAOResponse contructor
     * @param {boolean} success The action result. True if action was executed successfully. Otherwise, false.
     * @param {object} data The received data
     * @param {string} errorDescription The error description.
     */
    constructor(success, data, errorDescription) {
        this.success = success;
        this.data = data;
        this.errorDescription = errorDescription;
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
     * @param {string} errorDescription  
     * @returns {DAOResponse}
     */
    static createFailedResponse(errorDescription, operation, collectionName, filters) {
        let description = `Operation : ${operation} | Collection Name : ${collectionName} | Filter : ${filters} | Error : ${errorDescription}`;
        return new DAOResponse(false, null, description);
    }
}

module.exports = {DAOResponse};