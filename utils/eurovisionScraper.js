const cheerio = require('cheerio');

const EventName = {
    FIRST_SEMI_FINAL : "first-semi-final",
    SECOND_SEMI_FINAL : "second-semi-final",
    GRAND_FINAL : "grand-final"
}

const EventMapper = new Map([
    [EventName.FIRST_SEMI_FINAL, "https://www.eurovision.com/eurovision-song-contest/vienna-2026/vienna-2026-semi-final/"],
    [EventName.SECOND_SEMI_FINAL, "https://www.eurovision.com/eurovision-song-contest/vienna-2026/vienna-2026-second-semi-final/"],
    [EventName.GRAND_FINAL, "https://www.eurovision.com/eurovision-song-contest/vienna-2026/vienna-2026-grand-final/"]
])

const CodeMapper = new Map([
    ["albania", "ALB"],
    ["armenia", "ARM"],
    ["australia", "AUS"],
    ["austria", "AUT"], 
    ["azerbaijan", "AZE"],
    ["belgium", "BEL"],
    ["bulgaria", "BUL"],
    ["croatia", "CRO"],
    ["cyprus", "CYP"],
    ["czechia", "CZE"],
    ["denmark", "DEN"],
    ["estonia", "EST"],
    ["finland", "FIN"],
    ["france", "FRA"],
    ["georgia", "GEO"],
    ["germany", "GER"],
    ["greece", "GRE"],
    ["israel", "ISR"],
    ["italy", "ITA"],
    ["latvia", "LAT"],
    ["lithuania", "LTU"],
    ["luxembourg", "LUX"],
    ["malta", "MLT"],
    ["moldova", "MDA"],
    ["montenegro", "MNE"],
    ["norway", "NOR"],
    ["poland", "POL"],
    ["portugal", "POR"],
    ["romania", "ROM"],
    ["sanmarino", "SMR"],
    ["serbia", "SRB"],
    ["sweden", "SWE"],
    ["switzerland", "SUI"],
    ["ukraine", "UKR"],
    ["unitedkingdom", "GBR"]
])

class EurovisionScraper {
    constructor() {

    }

    async scrapeEvent(eventName) {
        const url = EventMapper.get(eventName);

        if (url == null) throw new Error(`Event name [${eventName}] is not supported.`)

        return await this.#scrapeEventData(eventName, url);
    }

    scrapeCountry(countryName) {

    }

    async #scrapeEventData(eventName, url) {
        const $ = await this.#fetchSite(url);
        const entries = $("div#scoreboard-content .scoreboard-entry");

        const countries = []

        entries.each((index, item) => {
            const entry = $(item);
            const country = this.#extractCountry(index + 1, entry)

            countries.push(country)
        })

        const data = {
            eventName : eventName,
            countries : countries
        }

        return data;
    }

    #extractCountry(runningOrder, entry) {
        const artist = entry.find("i.icon-microphone-2").next("p").text();
        const song = entry.find("i.icon-music").next("p").text();
        const countryName = entry.find("p.country-badge-name").text()
        const code = CodeMapper.get(countryName.replace(/\s+/g,'').toLowerCase())

        const country = {
            code: code,
            name: countryName,
            runningOrder: runningOrder,
            artist: artist,
            song: song
        }

        return country
    }

    async #fetchSite(url) {
        try {
            const response = await fetch(url);            
            const htmlString = await response.text();

            const doc = cheerio.load(htmlString);

            return doc;
            
        } catch (e) {
            throw new Error("Failed to fetch or parse site", e)
        }
    }
}

module.exports = { EurovisionScraper, EventName };