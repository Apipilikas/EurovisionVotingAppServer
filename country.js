class Country {
    constructor(code, name, qualified, runningOrder, votes, totalVotes, flagColors, artist, song) {
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
}

module.exports = Country;