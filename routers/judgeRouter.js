const judgeRouter = require('express').Router();
const { ErrorResponse } = require('../utils/responses');

// judgeRouter.get("/judges/all", (req, res) => {
//     judgeDAO.getAll()
//     .then(response => {
//         if (response.success) {
//             res.status(200).json({judges : convertToJudgeArray(response.data)});
//         }
//         else {
//             res.status(404).json(ErrorResponse.createResponse(response.errorCode, "Judges", null).toJSON());
//         }
//     });
// });

// judgeRouter.get("/judges/:code", (req, res) => {
//     let code = req.params.code;

//     judgeDAO.getSpecific(code)
//     .then(response => {
//         if (response.success) {
//             res.status(200).json({judge : response.data});
//         }
//         else {
//             res.status(404).json(ErrorResponse.createResponse(response.errorCode, "Judge", code).toJSON());
//         }
//     });
// });

// judgeRouter.post("/judges", (req, res) => {
//     let judge = createJudge(req.body);

//     judgeDAO.insert(judge, ["online"])
//     .then(response => {
//         if (response.success) res.status(201).send();
//         else {
//             res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Judge", judge.code).toJSON());
//         }
//     })

// });

// judgeRouter.put("/judges/:code", (req, res) => {
//     let code = req.params.code;

//     judgeDAO.update(code, req.body)
//     .then(response => {
//         if (response.success) res.status(200).send();
//         else {
//             res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Judge", code).toJSON());
//         }
//     });
// });

// judgeRouter.delete("/judges/:code", (req, res) => {
//     let code = req.params.code;

//     judgeDAO.delete(code)
//     .then(response => {
//         if (response.success) res.status(204).send();
//         else {
//             res.status(409).json(ErrorResponse.createResponse(response.errorCode, "Judge", code).toJSON());
//         }
//     });
// });

module.exports = {judgeRouter};