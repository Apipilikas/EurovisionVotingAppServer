const mongodb = require("./mongodb");
const _ = require("lodash");
const { DAOResponse } = require("./utils/responses");

const Collection = {
    Judge: "Judge",
    Country: "Country"
}

const ErrorCode = {
    CANNOT_GET_ALL_RECORDS : "CANNOT_GET_ALL_RECORDS",
    CANNOT_GET_SPECIFIC_RECORD : "CANNOT_GET_SPECIFIC_RECORD",
    RECORD_ALREADY_EXISTS : "RECORD_ALREADY_EXISTS",
    NO_RECORD_INSERTED : "NO_RECORD_INSERTED",
    CANNOT_INSERT_RECORD : "CANNOT_INSERT_RECORD",
    NO_RECORD_UPDATED : "NO_RECORD_UPDATED",
    CANNOT_UPDATE_RECORD : "CANNOT_UPDATE_RECORD",
    NO_RECORD_DELETED : "NO_RECORD_DELETED",
    CANNOT_DELETE_RECORD : "CANNOT_DELETE_RECORD"
}

class DAO {
    /**
     * DAO constructor
     * @param {string} collection 
     */
    constructor(collection) {
        if (collection == Collection.Judge) {
            this.collection = mongodb.judges;
            this.filter = "code";
        }
        else if (collection == Collection.Country) {
            this.collection = mongodb.countries;
            this.filter = "code";
        }
    }

    /**
     * Creates the Document filter
     * @param {string} id The key 
     * @returns {object}
     */
    getFilter(id) {
        return { [this.filter]: id };
    }

    /**
     * Gets all records
     * @param {Filter<Document>} filterQuery The filter predicate
     * @returns {Promise<DAOResponse>}
     */
    async getAll(filterQuery = {}) {
        try {
            const result = await this.collection.find(filterQuery).toArray();

            return DAOResponse.createSuccessfulResponse(result);
        }
        catch {}

        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_GET_ALL_RECORDS);
    }

    /**
     * Gets all records sorted
     * @param {Filter<Document>} filterQuery The filter predicate
     * @param {boolean} descending False for ascending and true for ascending
     * @param  {...string} sortFields Fields to be sorted
     * @returns {Promise<DAOResponse>}
     */
    async getAllSorted(filterQuery = {}, descending = false, ...sortFields) {
        const descendingFilter = descending ? -1 : 1;
        let sortFilter = {};

        for (var sortField of sortFields) {
            sortFilter[sortField] = descendingFilter;
        }

        try {
            const result = await this.collection.find(filterQuery).sort(sortFilter).toArray();
            
            return DAOResponse.createSuccessfulResponse(result);
        }
        catch {}

        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_GET_ALL_RECORDS);
    }

    /**
     * Gets a specific record
     * @param {string} id The key of the record we want to get
     * @returns {Promise<DAOResponse>}
     */
    async getSpecific(id) {
        const filter = this.getFilter(id);

        try {
            const result = await this.collection.findOne(filter);

            return DAOResponse.createSuccessfulResponse(result);
        }
        catch { }
        
        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_GET_SPECIFIC_RECORD);
    }

    /**
     * Inserts a new record
     * @param {*} data Data we want to insert
     * @param {*} fieldsToOmit Fields we want to omit and not store
     * @returns {Promise<DAOResponse>}
     */
    async insert(data, fieldsToOmit = null) {
        if (fieldsToOmit != null) data = _.omit(data, fieldsToOmit);
        
        if (data[this.filter] != null) {
            try {
                const ack = await this.collection.insertOne(data);

                if (ack.insertedId != null) {
                    return DAOResponse.createSuccessfulResponse();
                }
            }
            catch (error) {
                if (error.message.includes("E11000")) {
                    return DAOResponse.createFailedResponse(ErrorCode.RECORD_ALREADY_EXISTS);
                }

                return DAOResponse.createFailedResponse(ErrorCode.NO_RECORD_INSERTED);
            }
        }
        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_INSERT_RECORD);
    }

    /**
     * Updates a record
     * @param {*} id The key of the record we want to be updated
     * @param {*} updatedData Data we want to be updated
     * @returns 
     */
    async update(id, updatedData) {
        const filter = this.getFilter(id);
        const updatedDoc = { $set: updatedData };

        try {
            const ack = await this.collection.updateOne(filter, updatedDoc);

            if (ack.modifiedCount == 0) {
                return DAOResponse.createFailedResponse(ErrorCode.NO_RECORD_UPDATED);
            }
            else {
                return DAOResponse.createSuccessfulResponse();
            }
        }
        catch { }

        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_UPDATE_RECORD);
    }

    /**
     * Deletes a record
     * @param {*} id The key of the record we want to be deleted
     * @returns 
     */
    async delete(id) {
        const filter = this.getFilter(id);

        try {
            const ack = await this.collection.deleteOne(filter);

            if (ack.deletedCount == 0) {
                return DAOResponse.createFailedResponse(ErrorCode.NO_RECORD_DELETED);
            }
            else {
                return DAOResponse.createSuccessfulResponse();
            }
        }
        catch { }

        return DAOResponse.createFailedResponse(ErrorCode.CANNOT_DELETE_RECORD);
    }
}

module.exports = {
    DAO,
    Collection
};