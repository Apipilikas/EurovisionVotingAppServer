const countryRouter = require('express').Router();
const { DAO, Collection } = require('../utils/dao');
const { convertToCountryArray } = require('../utils/dataUtils');
const { ErrorResponse } = require('../utils/responses');

const countryDAO = new DAO(Collection.Country);

countryRouter.get("/countries/runningCountry", (req, res) => {
    res.status(200).json({runningOrder : 0});
});

countryRouter.get("/countries/all", (req, res) => {
    countryDAO.getAll()
    .then(response => {
        if (response.success) {
            res.status(200).json({countries : convertToCountryArray(response.data)});
        }
        else {
            res.status(404).json(ErrorResponse.createResponse(response.errorCode, "Countries", null).toJSON());
        }
    });
});

countryRouter.get("/countries/:code", (req, res) => {
    let code = req.params.code;

    countryDAO.getSpecific(code)
    .then(response => {
        if (response.success) {
            res.status(200).json({country : response.data});
        }
        else {
            res.status(404).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
});

countryRouter.post("/countries", (req, res) => {
    let country = createCountry(req.body);

    countryDAO.insert(country)
    .then(response => {
        if (response.success) res.status(201).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", country.code).toJSON());
        }
    });
});

countryRouter.put("/countries/:code", (req, res) => {
    let code = req.params.code;

    countryDAO.update(code, req.body)
    .then(response => {
        if (response.success) res.status(200).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
});

countryRouter.delete("/countries/:code", (req, res) => {
    let code = req.params.code;

    countryDAO.delete(code)
    .then(response => {
        if (response.success) res.status(204).send();
        else {
            res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Country", code).toJSON());
        }
    });
});

module.exports = {countryRouter};