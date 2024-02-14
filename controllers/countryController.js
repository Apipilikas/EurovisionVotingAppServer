const { getAllCountries, getSpecificCountry, createNewCountry, updateCountry, updateJudgeVotes, deleteCountry } = require("../requests/countryRequests");
const { Country } = require("../schemas/country");
const { ErrorResponse } = require("../utils/responses");
const { SocketIO } = require("../socketio");

module.exports.getAllCountries = (req, res, next) => {
    getAllCountries()
    .then(response => {
        if (response.success) {
            res.status(200).json({countries : Country.convertToArray(response.data)});
        }
        else {
            res.status(404).json(ErrorResponse.create(response.errorCode, "Judges", null).toJSON());
        }
    })
};

module.exports.getSpecificCountry = (req, res, next) => {
    let code = req.params.code;

    getSpecificCountry(code)
    .then(response => {
        if (response.success) {
            res.status(200).json({country : response.data});
        }
        else {
            res.status(404).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
};

module.exports.createNewCountry = (req, res, next) => {
    createNewCountry(req.body)
    .then(response => {
        if (response.success) res.status(201).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", country.code).toJSON());
        }
    });
};

module.exports.updateCountry = (req, res, next) => {
    let code = req.params.code;

    updateCountry(code, req.body)
    .then(response => {
        if (response.success) res.status(200).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
};

module.exports.updateJudgeVotes = (req, res, next) => {
    let countryCode = req.params.countrycode;
    let judgeCode = req.params.judgecode;
    let points = req.body.points;

    updateJudgeVotes(countryCode, judgeCode, points)
    .then(response => {
        if (response.success) {
            res.status(200).send();
            SocketIO.sendVote(judgeCode, countryCode, points);
        }
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", countryCode).toJSON());
        }
    })
};

module.exports.deleteCountry = (req, res, next) => {
    let code = req.params.code;

    deleteCountry(code)
    .then(response => {
        if (response.success) res.status(204).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
};