const { UUIDUtils } = require("../../utils/uuidUtils");
const { DAOModel } = require("./daoModel");

class JudgeModel extends DAOModel {
    constructor() {
        super("Judge");
        this.strictMode = false;
    }

    initModel() {
        this.codeField = this.pushNewField("code", String, false, true);
        this.nameField = this.pushNewField("name", String, false, false);
        this.originCountryField = this.pushNewField("originCountry", String, false, false);
        this.adminField = this.pushNewField("admin", Boolean, false, false);
        this.onlineField = this.pushNewField("online", Boolean, false, false);
        this.onlineField.nonStored = true;
        this.policyCodeField = this.pushNewField("policyCode", String, false, false);
        this.policyCodeField.nullable = true;
        this.policyCodeField.defaultValue = null;
        this.activeField = this.pushNewField("active", Boolean, false, false);
    }
    
    /**
     * @override
     */
    pushNewRecord(code, name, originCountry, policyCode, active) {
        return super.pushNewRecord(code, name, originCountry, false, false, policyCode, active);
    }

    getJudgeOriginCountry(judgeCode) {
        let record = this.records.findByPrimaryKey(judgeCode);
        return record?.getValue(this.originCountryField.fieldName);
    }

    /**
     * 
     * @param {*} judgeCode 
     * @returns {Boolean}
     */
    isJudgeAuthorized(judgeCode) {
        let record = this.records.findByPrimaryKey(judgeCode);
        return record?.getValue(this.adminField.fieldName);
    }

    createUniqueCode(judgeName = "") {
        const maxPrefixLength = 2;

        let prefixLength = Math.min(judgeName.length, maxPrefixLength);
        let uniqueID = UUIDUtils.generateUUID().substring(0, 5 - prefixLength);

        return judgeName.substring(0, prefixLength) + uniqueID;
    }
}

module.exports = {JudgeModel};