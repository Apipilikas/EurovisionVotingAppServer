class Judge {
    /**
     * Judge constructor
     * @param {string} code 
     * @param {string} name 
     * @param {string} originCountry 
     * @param {boolean} admin 
     * @param {boolean} online 
     */
    constructor(code, name, originCountry, admin = false, online = false) {
        this.code = code;
        this.name = name;
        this.originCountry = originCountry;
        this.admin = admin;
        this.online = online;
    }

    /**
     * Creates a Judge instance.
     * @param {string} code 
     * @param {string} name 
     * @param {string} originCountry 
     * @param {boolean} admin 
     * @returns {Judge}
     */
    static create(code, name, originCountry, admin = false) {
        return new Judge(code, name, originCountry, admin);
    }

    /**
     * Converts json array to Judge array
     * @param {object[]} results 
     * @returns {Judge[]}
     */
    static convertToArray(results) {
        let judgesArray = [];
    
        for (var result of results) {
            let judge = new Judge(result.code, result.name, result.originCountry, result.admin);
            judgesArray.push(judge);
        }
    
        return judgesArray;
    }
}

module.exports = { Judge };