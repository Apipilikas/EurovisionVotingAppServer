class Judge {
    constructor(code, name, originCountry, online = false) {
        this.code = code;
        this.name = name;
        this.originCountry = originCountry;
        this.online = online;
    }
}

module.exports = Judge;