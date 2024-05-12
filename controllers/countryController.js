const { CountryRequests } = require("../requests/countryRequests");
const { ErrorResponse } = require("../utils/responses");
const { SocketIO } = require("../socketio");
const { RunningCountryCache, VotingStatusesCache, CountriesCache } = require("../cache");
const { VerificationUtils } = require("../utils/verificationUtils");

const collectionInstanceName = "Country";
const collectionInstanceNamePlural = "Countries";

module.exports.getRunningCountry = (req, res, next) => {
    let runningCountry = RunningCountryCache.getRunningCountry();
    let runningCountryCode = RunningCountryCache.getRunningCountryCode();
    let votingStatus = VotingStatusesCache.getVotingStatusByCountryCode(runningCountryCode);

    res.status(200).json({runningCountry : runningCountry, runningCountryCode : runningCountryCode, votingStatus : votingStatus});
};

module.exports.getAllVotingStatuses = (req, res, next) => {
    res.status(200).json({votingStatuses : VotingStatusesCache.getVotingStatuses()});
};

module.exports.getSpecificVotingStatus = (req, res, next) => {
    res.status(200).json({status : VotingStatusesCache.getVotingStatusByCountryCode(req.params.countrycode)});
};

module.exports.getAllCountries = (req, res, next) => {
    if (CountriesCache.isInitialized()) {
        res.status(200).json({countries : CountriesCache.getCountries()});
        return;
    }

    CountryRequests.getAllCountriesSortedByRunningOrder()
    .then(response => {
        if (response.success) {
            let countries = response.data;
            CountriesCache.setCountries(countries);
            
            res.status(200).json({countries : countries});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Judges", null).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.getSpecificCountry = (req, res, next) => {
    let code = req.params.code;

    if (CountriesCache.isInitialized()) {
        let country = CountriesCache.findCountry(code);

        if (code != null) {
            res.status(200).json({country : country});
            return;
        }
    }

    CountryRequests.getSpecificCountry(code)
    .then(response => {
        if (response.success) {
            res.status(200).json({country : response.data});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Country", code).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.createNewCountry = (req, res, next) => {
    CountryRequests.createNewCountry(req.body)
    .then(response => {
        if (response.success) {
            CountriesCache.addCountry(req.body);
            res.status(201).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Country", req.body.code).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.updateCountry = (req, res, next) => {
    let code = req.params.code;

    CountryRequests.updateCountry(code, req.body)
    .then(response => {
        if (response.success) {
            CountriesCache.updateCountry(code, req.body);
            res.status(200).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Country", code).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.updateJudgeVotes = (req, res, next) => {
    let countryCode = req.params.countrycode;
    let judgeCode = req.params.judgecode;
    let points = parseInt(req.body.points);

    let isCountryJudgeOriginCountry = VerificationUtils.isCountryJudgeOriginCountry(countryCode, judgeCode);

    if (isCountryJudgeOriginCountry) {
        res.status(409).json(ErrorResponse.create("CANNOT_VOTE_ORIGIN_COUNTRY", "Judge", judgeCode).toJSON());
        return;
    }

    CountryRequests.updateJudgeVotes(countryCode, judgeCode, points)
    .then(response => {
        if (response.success) {
            res.status(200).send();
            CountriesCache.setVotes(judgeCode, countryCode, points);
            SocketIO.sendVote(judgeCode, countryCode, points, CountriesCache.getTotalVotes(countryCode));
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Country", countryCode).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.clearCountryTotalVotes = (req, res, next) => {
    let code = req.params.code;

    let data = {votes : new Object(), totalVotes : 0};

    CountryRequests.updateCountry(code, data)
    .then(response => {
        if (response.success) {
            CountriesCache.updateCountry(code, data);
            res.status(200).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Country", code).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
}

module.exports.deleteCountry = (req, res, next) => {
    let code = req.params.code;

    CountryRequests.deleteCountry(code)
    .then(response => {
        if (response.success) {
            CountriesCache.deleteCountry(code);
            res.status(204).send();
        }
        else {
            res.status(409).json(ErrorResponse.create(response.errorCode, "Country", code).toJSON());
        }
    })
    .catch(e => {res.status(500).json(ErrorResponse.createServerErrorResponse(e.Message))});
};

module.exports.getWinnerCountry = (req, res, next) => {
    res.status(200).json({country : CountriesCache.getWinnerCountry()});
}