const { Record } = require("db-model-handler");
const { VotingSchema } = require("../schemas/votingSchema");

class PolicyApplier {
    record
    mapper
    success = false
    errorMessage

    /**
     * PolicyApplier contructor
     * @param {Record} judgeRecord 
     * @param {VotesMapper} votesMapper 
     */
    constructor(judgeRecord, votesMapper) {
        this.record = judgeRecord;
        this.mapper = votesMapper;
    }

    /**
     * Applies policy to the given points. Previous points needed to decrease counter.
     * @param {*} previousPoints 
     * @param {*} currentPoints 
     * @returns 
     */
    apply(previousPoints, currentPoints) {
        let policy = this.record.getParentRecord(VotingSchema.FK_Policy_Judge);
        let policyEntries = policy?.getChildRecords(VotingSchema.FK_Policy_PolicyEntry);
        let policyEntry = policyEntries?.find(pe => pe.getValue("points") == currentPoints);

        if (policyEntry != null) {
            let count = this.mapper.get(currentPoints) + 1;
            let times = policyEntry.getValue("times");

            if (count > times) {
                this.errorMessage = `You have exceeded the maximum number of [${currentPoints}] points. You should vote only [${times}] times for point [${currentPoints}]!`;
                return;
            }
        }

        this.mapper.increase(currentPoints);

        if (previousPoints != 0) {
            this.mapper.decrease(previousPoints);
        }

        this.success = true;
    }
}

class VotesMapper extends Map {

    /**
     * VotesMapper constructor
     */
    constructor() {
        super();
        this.#initVotesMapper();
    }

    /**
     * Generates mapper based on judge's vote.
     * @param {Record} judgeRecord 
     */
    static generate(judgeRecord) {
        let mapper = new VotesMapper();
        let votes = judgeRecord.getChildRecords(VotingSchema.FK_Judge_Vote);

        for (let record of votes) {
            let points = record.getValue("points");
            mapper.increase(points);
        }

        return mapper;
    }

    increase(points) {
        let count = this.get(points);
        this.set(points, count + 1);
    }

    decrease(points) {
        let count = this.get(points);
        this.set(points, count - 1);
    }

    clear(points) {
        this.set(points, 0);
    }

    #initVotesMapper() {
        this.set(1, 0);
        this.set(2, 0);
        this.set(3, 0);
        this.set(4, 0);
        this.set(5, 0);
        this.set(6, 0);
        this.set(7, 0);
        this.set(8, 0);
        this.set(10, 0);
        this.set(12, 0);
    }
}

module.exports = {PolicyApplier, VotesMapper};