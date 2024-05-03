class Country {
    /**
     * Country constructor
     * @param {string} code 
     * @param {string} name 
     * @param {boolean} qualified 
     * @param {number} runningOrder 
     * @param {object[]} votes 
     * @param {number} totalVotes 
     * @param {string[]} flagColors 
     * @param {string} artist 
     * @param {string} song 
     */
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

    /**
     * Creates a Country instance.
     * @param {string} code 
     * @param {string} name 
     * @param {boolean} qualified 
     * @param {number} runningOrder 
     * @param {string[]} flagColors 
     * @param {string} artist 
     * @param {string} song 
     * @returns {Country}
     */
    static create(code, name, qualified, runningOrder, flagColors, artist, song) {
        let votes = {};

        return new Country(code, name, qualified, parseInt(runningOrder), votes, 0, flagColors, artist, song);
    }

    /**
     * Converts json array to Country array.
     * @param {object[]} results 
     * @returns {Country[]}
     */
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