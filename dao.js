const mongodb = require("./mongodb");
const _ = require("lodash");
const { DAOResponse } = require("./utils/responses/daoResponse");
const { Model } = require("db-model-handler");
const { ClientSession } = require("mongodb");

const Collection = {
    Judge: "Judge",
    Country: "Country",
    Vote : "Vote",
    Policy : "Policy",
    PolicyEntry : "PolicyEntry"
}

const CollectionMapping = new Map([
    [Collection.Judge, mongodb.judges],
    [Collection.Country, mongodb.countries],
    [Collection.Vote, mongodb.votes],
    [Collection.Policy, mongodb.policies],
    [Collection.PolicyEntry, mongodb.policyEntries]
]
);

const Operation = {
    GET : "GET",
    INSERT : "INSERT",
    UPDATE : "UPDATE",
    DELETE : "DELETE",
    TRANSACTION : "TRANSACTION"
}

class DAO {
    /**
     * DAO constructor
     * @param {String} modelName 
     * @param {String[]} primaryKeys
     */
    constructor(modelName, primaryKeys) {
        this.collection = CollectionMapping.get(modelName);
        this.filters = primaryKeys;
    }

    get collectionName() {
        return this.collection.collectionName;
    }

    /**
     * Creates DAO instance based on a given model.
     * @param {Model} model 
     * @returns {DAO} Dao instance
     */
    static createByModel(model) {
        return new DAO(model.modelName, model.getPrimaryKeyName())
    }

    /**
     * 
     * @param {*} transactionOptions Transaction options. If the provided parameter is null, default transaction options are applied.
     * @returns 
     */
    static startSession(transactionOptions = null) {
        transactionOptions = transactionOptions == null ? DAO.getTransactionOptions() : transactionOptions;
        return mongodb.client.startSession({ transactionOptions });
    }

    /**
     * Default transaction options.
     * @returns 
     */
    static getTransactionOptions() {
        let transactionOptions = {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' }
        };

        return transactionOptions;
    }

    /**
     * 
     * @param {Function} callbackFunction Callback function to run within transaction. Session should be provided as a parameter. If error is thrown,
     * transaction is aborted. Otherwise, transaction is committed successfully.
     */
    static async executeTransaction(callbackFunction) {
        let session = DAO.startSession();
        try {
            session.startTransaction();

            await callbackFunction(session);

            await session.commitTransaction();
            return DAOResponse.createSuccessfulResponse();
        }
        catch(e) {
            await session.abortTransaction();
            return DAOResponse.createFailedResponse(`Transaction has been aborted. Problem occured : ${e.message}`, Operation.TRANSACTION, null, null);
        }
        finally {
            session.endSession();
        }
    }

    /**
     * Creates the Document filter
     * @param  {any[]} ids The keys
     * @returns {object}
     */
    getFilter(ids) {
        let query = {};

        for (let i = 0; i < this.filters.length; i++) {
            query[this.filters[i]] = ids[i];
        }

        return query;
    }

    #containsFilters(data) {
        let count = 0;
        for (let filter of this.filters) {
            if (data[filter]!= null) count++;
        }

        return count == this.filters.length;
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
        catch(e) {
            return DAOResponse.createFailedResponse(e.message, Operation.GET, this.collectionName, filterQuery);
        }
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
        catch(e) {
            return DAOResponse.createFailedResponse(e.message, Operation.GET, this.collectionName, filterQuery);
        }
    }

    /**
     * Gets a specific record
     * @param {string} ids The key of the record we want to get
     * @returns {Promise<DAOResponse>}
     */
    async getSpecific(ids) {
        const filter = this.getFilter(ids);

        try {
            const result = await this.collection.findOne(filter);

            return DAOResponse.createSuccessfulResponse(result);
        }
        catch(e) {
            return DAOResponse.createFailedResponse(e.message, Operation.GET, this.collectionName, filter);
         }
    }

    /**
     * Inserts a new record
     * @param {*} data Data we want to insert
     * @param {ClientSession} session Session provided for transaction use only. Otherwise, operation is handled individually.
     * @returns {Promise<DAOResponse>}
     */
    async insert(data, session = null) {
        // if (fieldsToOmit != null) data = _.omit(data, fieldsToOmit);
        
        if (this.#containsFilters(data)) {
            try {
                const ack = await this.collection.insertOne(data, this.#handleSessionOption(session));

                if (ack.insertedId != null) {
                    return DAOResponse.createSuccessfulResponse();
                }
            }
            catch (e) {
                // if (error.message.includes("E11000")) {
                //     return DAOResponse.createFailedResponse(ErrorCode.RECORD_ALREADY_EXISTS);
                // }

                return DAOResponse.createFailedResponse(e.message, Operation.INSERT, this.collectionName, null);
            }
        }

        return DAOResponse.createFailedResponse("Provided data do not contain the Primary Keys.", Operation.INSERT, this.collectionName, null);
    }

    /**
     * Updates a record
     * @param {*} ids The key of the record we want to be updated
     * @param {*} updatedData Data we want to be updated. Updates only the specified fields.
     * @param {ClientSession} session Session provided for transaction use only. Otherwise, operation is handled individually.
     * @returns 
     */
    async update(ids, updatedData, session = null) {
        const filter = this.getFilter(ids);
        const updatedDoc = { $set: updatedData };

        try {
            const ack = await this.collection.updateOne(filter, updatedDoc, this.#handleSessionOption(session));

            if (ack.modifiedCount == 0) {
                return DAOResponse.createFailedResponse("No modified record found!", Operation.UPDATE, this.collectionName, filter);
            }
            else {
                return DAOResponse.createSuccessfulResponse();
            }
        }
        catch(e) { 
            return DAOResponse.createFailedResponse(e.message, Operation.UPDATE, this.collectionName, filter);
        }
    }

    /**
     * Deletes a record
     * @param {*} ids The keys of the record we want to be deleted
     * @param {ClientSession} session Session provided for transaction use only. Otherwise, operation is handled individually.
     * @returns 
     */
    async delete(ids, session = null) {
        const filter = this.getFilter(ids);
        
        try {
            const ack = await this.collection.deleteOne(filter, this.#handleSessionOption(session));

            if (ack.deletedCount == 0) {
                return DAOResponse.createFailedResponse("No deleted record found!", Operation.DELETE, this.collectionName, filter);
            }
            else {
                return DAOResponse.createSuccessfulResponse();
            }
        }
        catch(e) { 
            return DAOResponse.createFailedResponse(e.message, Operation.DELETE, this.collectionName, filter);
        }
    }

    #handleSessionOption(session) {
        if (session == null) return null;
        return { session };
    }
}

module.exports = {
    DAO,
    Collection
};