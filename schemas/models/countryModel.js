const { DAOModel } = require("./daoModel");

class CountryModel extends DAOModel {
    constructor() {
        super("Country");
        this.strictMode = false;
    }

    initModel() {
        this.codeField = this.pushNewField("code", String, false, true);
        this.nameField = this.pushNewField("name", String, false, false);
        this.qualifiedField = this.pushNewField("qualified", Boolean, false, false);
        this.runningOrderField = this.pushNewField("runningOrder", Number, false, false);
        this.totalVotesField = this.pushNewField("totalVotes", Number, false, false);
        this.totalVotesField.nonStored = true;
        this.artistField = this.pushNewField("artist", String, false, false);
        this.songField = this.pushNewField("song", String, false, false);
        this.votingStatusField = this.pushNewField("votingStatus", String, false, false);
        this.votingStatusField.nonStored = true;
        this.votingStatusField.defaultValue = "CLOSED";
        this.flagColor1 = this.pushNewField("flagColor1", String, false, false);
        this.flagColor2 = this.pushNewField("flagColor2", String, false, false);
        this.flagColor3 = this.pushNewField("flagColor3", String, false, false);
    }

    serializeWithVotesForDisplay() {
        let recordsArray = [];
        for (let record of this.records) {
            let obj = record.serializeForDisplay();
            let votes = {};

            let childRecords = record.getChildRecords("FK_Country_Vote");
            childRecords?.forEach(childRecord => votes[childRecord.getValue("judgeCode")] = childRecord.getValue("points"));

            obj.votes = votes;
            recordsArray.push(obj);
        }

        return recordsArray;        
    }
}

module.exports = {CountryModel};