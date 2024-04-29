const { JudgesCache } = require("../cache");
const { JudgeRequests } = require("../requests/judgeRequests");
const { ErrorResponse } = require("./responses");

var VerificationUtils = {};

VerificationUtils.authorizeJudge = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(400).json(ErrorResponse.create("NO_JUDGE_CREDENTIALS_FOUND", null, null));
    }

    let judgeCode = req.headers.authorization;

    JudgeRequests.getSpecificJudge(judgeCode)
    .then(response => {
        if (response.success) {
            let judge = response.data;
            let isAdmin = judge?.admin;
            let name = judge?.name;

            if (isAdmin) {
                console.log("has permission");
                next();
            }
            else {
                res.status(403).json(ErrorResponse.create("JUDGE_PERMISSION_DENIED", "Judge", name));
            }
            return;
        }
    })
}

VerificationUtils.isCountryJudgeOriginCountry = (countryCode, judgeCode) => {
    let judge = JudgesCache.findJudge(judgeCode);

    if (judge != null && judge.originCountry == countryCode) return true;

    return false;
}

module.exports = { VerificationUtils };