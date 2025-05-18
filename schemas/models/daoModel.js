const { Model, Record, RecordState } = require("db-model-handler");
const { DAO } = require("../../dao");
const { DAOResponse } = require("../../utils/responses/daoResponse");
const { ClientSession } = require("mongodb");

class DAOModel extends Model {
    #dao

    constructor(modelName) {
        super(modelName);
        this.#dao = DAO.createByModel(this);
    }

    /**
     * @returns {DAO}
     */
    get dao() {
        return this.#dao;
    }

    save(session = null) {
        if (session = null) {
            DAO.executeTransaction(async (session) => {
                this.saveChanges(session);
            })
        }

        for (let record of this.records) {
            if (record.hasChanges()) {
                record.saveChanges(session);
            }
        }
    }
}

class DAOModelSaveResult {
    constructor(success, modifiedRecords, errorDescription) {
        this.success = success;
        this.modifiedRecords = modifiedRecords;
        this.errorDescription = errorDescription;
    }
}

/**
 * @param {ClientSession} session Session is provided for transaction use only. Otherwise, operation is handled individually.
 * @returns {Promise<DAOModelSaveResult>}
 */
Record.prototype.saveChanges = async function(session = null) {
    let response;
    let obj = this.getChangesForSave();

    switch (this.state) {
        case 0: //RecordState.UNMODIFIED
            return new DAOModelSaveResult(true, null, null);
        case 1: //RecordState.ADDED
            response = await this.model.dao.insert(obj, session);
            break;
        case 2: //RecordState.MODIFIED
            response = await this.model.dao.update(this.getPrimaryKeyValue(), obj, session);
            break;
        case 3: //RecordState.DELETED
            response = await this.model.dao.delete(this.getPrimaryKeyValue(), session);
            break;
        case 4: //RecordState.DETACHED
            throw new DAOModelSaveResult(false, [this], "Cannot save a detached record!");
    }

    if (response != null) {
        return new DAOModelSaveResult(response.success, [this], response.errorDescription);
    }

    return new DAOModelSaveResult(false, [this], "Error while saving changes.");
}

/**
 * @param {ClientSession} session Session is provided for transactional use only. Otherwise, operation is handled individually.
 * @returns {Promise<DAOModelSaveResult>}
 */
Record.prototype.saveAndApplyChanges = async function() {
    let result = await this.saveChanges();

    if (result?.modifiedRecords == null) return result;

    if (result?.success) {
        this.acceptChanges();
    }
    else {
        this.rejectChanges();
    }

    return result;
}

/**
 * @param {ClientSession} session Session is provided for transactional use only.
 * @returns {DAOModelSaveResult}
 */
Record.prototype.saveCascadeChanges = async function(session) {
    if (session == null) throw new Error("Session is null. This kind of operation should be executed only in transaction mode!");

    let modifiedRecords = []
    let result = await this.saveChanges(session);
    checkResponse(result, this);
    modifiedRecords.push(this);

    switch (this.state) {
        case 1: //RecordState.ADDED
        case 2: //RecordState.MODIFIED
            for (let relation of this.model.childRelations.findCascadeUpdatedOnes()) {
                let childRecords = this.getChildRecordsByRelation(relation);
                
                for (let record of childRecords) {
                    result = await record.saveChanges(session);
                    checkResponse(result, record);
                    modifiedRecords.push(record);
                }
            }
            break;
        case 3: //RecordState.DELETED
            for (let relation of this.model.childRelations.findCascadeDeletedOnes()) {
                let childRecords = this.getChildRecordsByRelation(relation, 1); //FieldValueVersion.ORIGINAL

                for (let record of childRecords) {
                    result = await record.saveChanges(session);
                    checkResponse(result, record);
                    modifiedRecords.push(record);
                }
            }
            break;
    }

    return new DAOModelSaveResult(true, modifiedRecords, null);    
}

/**
 * @param {ClientSession} session Session is provided for transactional use only.
 * @returns {Promise<DAOModelSaveResult>}
 */
Record.prototype.saveAndApplyCascadeChanges = async function(session) {
    if (session == null) throw new Error("Session is null. This kind of operation should be executed only in transaction mode!");

    let result = await this.saveCascadeChanges(session);

    if (result.success) {
        result.modifiedRecords.forEach(record => record.acceptChanges());
    }
    else {
        result.modifiedRecords.forEach(record => record.rejectChanges());
    }

    return result;
}

/**
 * 
 * @param {*} response 
 * @param {Record} record 
 */
function checkResponse(result, record) {
    if (!result?.success) {
        let message = `Error occured while saving record with key [${record.getPrimaryKeyValue()}] from model [${record.model.modelName}]. Details : ${result.errorDescription}.`;
        throw new Error(message);
    }
}

module.exports = {DAOModel};