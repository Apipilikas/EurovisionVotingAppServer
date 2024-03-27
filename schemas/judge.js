class Judge {

    constructor(code, name, originCountry, admin = false, online = false) {
        this.code = code;
        this.name = name;
        this.originCountry = originCountry;
        this.admin = admin;
        this.online = online;
    }

    static create(code, name, originCountry, admin = false) {
        return new Judge(code, name, originCountry, admin);
    }

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