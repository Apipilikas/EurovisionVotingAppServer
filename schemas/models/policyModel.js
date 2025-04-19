const { DAOModel } = require("./daoModel");

class PolicyModel extends DAOModel {    
    constructor() {
        super("Policy");
        this.strictMode = false;
    }

    initModel() {
        this.codeField = this.pushNewField("code", String, false, true);
        this.descriptionField = this.pushNewField("description", String, false, false);
    }

    /**
     * @override
     */
    serializeForDisplay() {
        let recordsArray = [];
        for (let record of this.records) {
            let obj = record.serializeForDisplay();
            let childRecordsArray = [];

            let childRecords = record.getChildRecords("FK_Policy_PolicyEntry");
            childRecords?.forEach(childRecord => childRecordsArray.push(childRecord.serializeForDisplay()));

            obj.policyEntries = childRecordsArray;
            recordsArray.push(obj);
        }

        return recordsArray;
    }
}

module.exports = {PolicyModel}