const { Record, Schema } = require("db-model-handler");
const { CountryModel } = require("./models/countryModel");
const { VoteModel } = require("./models/voteModel");
const { JudgeModel } = require("./models/judgeModel");
const { ServerErrorResponse } = require("../utils/responses/serverErrorResponse");
const { PolicyModel } = require("./models/policyModel");
const { PolicyEntryModel } = require("./models/policyEntryModel");

class VotingSchema extends Schema {
    static FK_Country_Vote = "FK_Country_Vote"
    static FK_Judge_Vote = "FK_Judge_Vote"
    static FK_Country_Judge = "FK_Country_Judge"
    static FK_Policy_Judge = "FK_Policy_Judge"
    static FK_Policy_PolicyEntry = "FK_Policy_PolicyEntry"

    isDataFetched = false
    dataLoading = null
    runningCountry = 0
    
    constructor() {
        super("VotingSchema");
    }

    initSchema() {
        this.policyModel = new PolicyModel();
        this.models.push(this.policyModel);

        this.countryModel = new CountryModel();
        this.models.push(this.countryModel);

        this.judgeModel = new JudgeModel();
        this.models.push(this.judgeModel);

        this.voteModel = new VoteModel();
        this.models.push(this.voteModel);

        this.policyEntryModel = new PolicyEntryModel();
        this.models.push(this.policyEntryModel);

        this.pushNewRelation(VotingSchema.FK_Country_Vote, this.countryModel.codeField, this.voteModel.countryCodeField, true, true);
        this.pushNewRelation(VotingSchema.FK_Judge_Vote, this.judgeModel.codeField, this.voteModel.judgeCodeField, true, true);
        this.pushNewRelation(VotingSchema.FK_Country_Judge, this.countryModel.codeField, this.judgeModel.originCountryField, true, false);
        this.pushNewRelation(VotingSchema.FK_Policy_Judge, this.policyModel.codeField, this.judgeModel.policyCodeField, true, false);
        this.pushNewRelation(VotingSchema.FK_Policy_PolicyEntry, this.policyModel.codeField, this.policyEntryModel.policyCodeField, true, true);
    }

    async fetchData() {
        if (this.isDataFetched) return;
        if (this.dataLoading == null) {
            this.dataLoading = this.loadData();
        }

        return this.dataLoading;
    }

    async loadData() {
        for (let model of this.models) {
            let response = await model.dao.getAll();
            initDataToModel(model, response.data);
        }
        this.isDataFetched = true;
    }

    clearData() {
        for (let model of this.models) {
            model.records.clear();
        }

        this.isDataFetched = false;
    }
}

function initDataToModel(model, objs) {
    if (objs == null) return;

    for (let obj of objs) {
        let newObj = {};
        newObj[Record.STATE_KEY] = 0;
        newObj[Record.CURRENT_VALUES_KEY] = obj;
        let record = Record.deserialize(model, newObj);
        model.records.push(record);
    }
}

const votingSchema = new VotingSchema();

const fetchVotingSchemaData =  async (req, res, next) => {
    try {
        await votingSchema.fetchData();
        next();
    }
    catch(e) {
        res.status(500).json(ServerErrorResponse.createServerError(e.message));
    }
}

module.exports = {VotingSchema, votingSchema, fetchVotingSchemaData};