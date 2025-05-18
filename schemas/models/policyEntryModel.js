const { DAOModel } = require("./daoModel");

class PolicyEntryModel extends DAOModel {
    
    constructor() {
        super("PolicyEntry");
        this.strictMode = false;
    }

    initModel() {
        this.codeField = this.pushNewField("code", String, false, true)
        this.policyCodeField = this.pushNewField("policyCode", String, false, false);
        this.pointsField = this.pushNewField("points", Number, false, false);
        this.timesField = this.pushNewField("times", Number, false, false);
    }
}

module.exports = {PolicyEntryModel}