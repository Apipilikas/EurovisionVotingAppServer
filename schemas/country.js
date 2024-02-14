class Country {

    constructor(code, name, qualified, runningOrder, 
                votes, totalVotes, flagColors, artist, song) {
        this.code = code;
        this.name = name;
        this.qualified = qualified;
        this.runningOrder = runningOrder;
        this.votes = votes;
        this.totalVotes = totalVotes;
        this.flagColors = flagColors;
        this.artist = artist;
        this.song = song;
    }

    static create(code, name, qualified, runningOrder, flagColors, artist, song) {
        let votes = {};

        return new Country(code, name, qualified, runningOrder, votes, 0, flagColors, artist, song);
    }

    static convertToArray(results) {
        let countriesArray = [];
    
        for (var result of results) {
            let country = new Country(result.code, result.name, result.qualified, 
                                        result.runningOrder, result.votes, result.totalVotes,
                                        result.flagColors, result.artist, result.song);
            countriesArray.push(country);
        }
    
        return countriesArray;
    }
}

module.exports = { Country };