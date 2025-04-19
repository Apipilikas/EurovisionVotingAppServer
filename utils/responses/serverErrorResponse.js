const { DBModelHandlerError : DBMHErrors } = require("db-model-handler");

const ErrorCode = {
    // Get Errors
    GET_ALL_ERROR : "GET_ALL_ERROR",
    GET_SPECIFIC_ERROR : "GET_SPECIFIC_ERROR",
    GET_NOT_FOUND_ERROR : "GET_NOT_FOUND_ERROR",
    // Insert Errors
    INSERT_ERROR : "INSERT_ERROR",
    // Update Errors
    UPDATE_ERROR : "UPDATE_ERROR",
    UPDATE_NOT_FOUND_ERROR : "UPDATE_NOT_FOUND_ERROR",
    // Delete Errors
    DELETE_ERROR : "DELETE_ERROR",
    DELETE_NOT_FOUND_ERROR : "DELETE_NOT_FOUND_ERROR",
    // Server Errors
    SERVER_ERROR : "SERVER_ERROR",
    AUTHORIZATION_ERROR : "AUTHORIZATION_ERROR",
    PERMISSION_DENIED_ERROR : "PERMISSION_DENIED_ERROR"
}

/**
 * This class is used for the DAO error representation.
 */
class ServerErrorResponse {
    /**
     * BaseErrorResponse constructor
     * @param {string} code The error code
     * @param {string} description The error description
     * @param {string} details The details of the error
     * 
     */
    constructor (code, description, details = null) {
        this.code = code;
        this.description = description;
        this.details = details;
    }

    //#region Get Errors
    static createDefGetAllError(details, modelName) {
        let description = `A problem has occurred while fetching all records from [${modelName}].`;
        return this.createGetAllError(description, details);
    }

    static createGetAllError(description, details = null) {
        return new ServerErrorResponse(ErrorCode.GET_ALL_ERROR, description, details);
    }

    static handleGetAllError(e, modelName) {
        if (e instanceof DBMHErrors.DBModelHandlerError) {
            return this.createGetAllError(e.message);
        }
        else {
            return this.createDefGetAllError(e.message, modelName);
        }
    }

    static createNotFoundOnGetError(modelName, ...codes) {
        let description = `Requested record with code [${this.#joinCodes(...codes)}] from [${modelName}] does not exist.`;
        return new ServerErrorResponse(ErrorCode.GET_NOT_FOUND_ERROR, description);
    }

    static createDefGetSpecificError(details, modelName, ...codes) {
        let description = `A problem has occurred while fetching record with code [${this.#joinCodes(...codes)}] from [${modelName}].`;
        return this.createGetSpecificError(description, details);
    }

    static createGetSpecificError(description, details = null) {
        return new ServerErrorResponse(ErrorCode.GET_SPECIFIC_ERROR, description, details);
    }

    static handleGetSpecificError(e, modelName, ...codes) {
        if (e instanceof DBMHErrors.DBModelHandlerError) {
            return this.createGetSpecificError(e.message);
        }
        else {
            return this.createDefGetSpecificError(e.message, modelName, ...codes);
        }
    }

    //#endregion

    //#region Insert Errors

    static createDefInsertError(details, modelName, ...codes) {
        let description = `Record with code [${this.#joinCodes(...codes)}] from [${modelName}] has not been inserted.`;
        return this.createInsertError(description, details);
    }

    static createInsertError(description, details = null) {
        return new ServerErrorResponse(ErrorCode.INSERT_ERROR, description, details);
    }

    static handleInsertError(e, modelName, ...codes) {
        if (e instanceof DBMHErrors.DBModelHandlerError) {
            return this.createInsertError(e.message);
        }
        else {
            return this.createDefInsertError(e.message, modelName, ...codes);
        }
    }

    //#endregion

    //#region Update Errors

    static createDefUpdateError(details, modelName, ...codes) {
        let description = `Record with code [${this.#joinCodes(...codes)}] from [${modelName}] has not been updated.`;
        return this.createUpdateError(description, details);
    }

    static createUpdateError(description, details = null) {
        return new ServerErrorResponse(ErrorCode.UPDATE_ERROR, description, details);
    }

    static handleUpdateError(e, modelName, ...codes) {
        if (e instanceof DBMHErrors.DBModelHandlerError) {
            return this.createUpdateError(e.message);
        }
        else {
            return this.createDefUpdateError(e.message, modelName, ...codes);
        }
    }

    static createNotFoundOnUpdateError(modelName, ...codes) {
        let description = `Record with code [${this.#joinCodes(...codes)}] from [${modelName}] has not been updated as it does not exist.`;
        return new ServerErrorResponse(ErrorCode.UPDATE_NOT_FOUND_ERROR, description);
    }

    //#endregion

    //#region Delete Errors

    static createDefDeleteError(details, modelName, ...codes) {
        let description = `Record with code [${this.#joinCodes(...codes)}] from [${modelName}] has not been deleted.`;
        return this.createDeleteError(description, details);
    }

    static createDeleteError(description, details) {
        return new ServerErrorResponse(ErrorCode.DELETE_ERROR, description, details);
    }

    static handleDeleteError(e, modelName, ...codes) {
        if (e instanceof DBMHErrors.DBModelHandlerError) {
            return this.createDeleteError(e.message);
        }
        else {
            return this.createDefDeleteError(e.message, modelName, ...codes);
        }
    }

    static createNotFoundOnDeleteError(modelName, ...codes) {
        let description = `Record with code [${this.#joinCodes(...codes)}] from [${modelName}] has not been deleted as it does not exist.`;
        return new ServerErrorResponse(ErrorCode.DELETE_NOT_FOUND_ERROR, description);
    }

    //#endregion

    //#region Server Errors

    static createServerError(details) {
        let description = `An internal problem has occurred while trying to fullfil a request.`;
        return new ServerErrorResponse(ErrorCode.SERVER_ERROR, description, details);
    }

    static createAuthorizationError() {
        let description = `Authorization token is missing from request. This kind of operation is for authorized judges only!`;
        return new ServerErrorResponse(ErrorCode.AUTHORIZATION_ERROR, description);
    }

    static createPermissionDeniedError(...codes) {
        let description = `Judge with code [${this.#joinCodes(...codes)}] is not authorized to perform this operation.`;
        return new ServerErrorResponse(ErrorCode.PERMISSION_DENIED_ERROR, description);
    }

    //#endregion

    static #joinCodes(...codes) {
        return codes.join(", ");
    }

    toJSON() {
        return {error : {code : this.code, description : this.description, details : this.details}};
    }
}

module.exports = {ServerErrorResponse, ErrorCode};