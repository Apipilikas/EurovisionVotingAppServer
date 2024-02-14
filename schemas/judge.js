class Judge {

    constructor(code, name, originCountry, online = false) {
        this.code = code;
        this.name = name;
        this.originCountry = originCountry;
        this.online = online;
    }

    static create(code, name, originCountry) {
        return new Judge(code, name, originCountry);
    }

    static convertToArray(results) {
        let judgesArray = [];
    
        for (var result of results) {
            let judge = new Judge(result.code, result.name, result.originCountry);
            judgesArray.push(judge);
        }
    
        return judgesArray;
    }
}

export { Judge };