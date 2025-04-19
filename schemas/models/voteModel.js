const { DAOModel } = require("./daoModel");

class VoteModel extends DAOModel {
    constructor() {
        super("Vote");
    }

    initModel() {
        this.countryCodeField = this.pushNewField("countryCode", String, false, true);
        this.judgeCodeField = this.pushNewField("judgeCode", String, false, true);
        this.pointsField = this.pushNewField("points", Number, false, false);
    }
}

module.exports = {VoteModel};