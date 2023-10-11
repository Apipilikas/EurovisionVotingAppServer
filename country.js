class Country {
    constructor(countryID, qualified, runningOrder, votes) {
        this._countryID = countryID;
        this._qualified = qualified;
        this._runningOrder = runningOrder;
        this._votes = votes;
    }

    get countryID() {
        return this._countryID;
    }

    get qualified() {
        return this._qualified;
    }

    get runningOrder() {
        this._runningOrder;
    }

    get votes() {
        this._votes;
    }

    getJudgeVotes(judgeID) {
        return this.votes[judgeID];
    }

    set countryID(newCountryID) {
        this._countryID = newCountryID;
    }

    setQualified() {
        this._qualified = true;
    }

    set votes(newVotes) {
        this._votes = newVotes;
    }
}

module.exports = Country;