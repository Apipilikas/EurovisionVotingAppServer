const nodemailer = require("nodemailer");
const { EmailResponse } = require("../utils/responses/emailResponse");
const { Email } = require("./email");

let emailTransporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 465,
    secure : true,
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_APP_PASSWORD
    },
    tls : {
        rejectUnauthorized : false
    },
    logger : true,
    debug : true
});

let EmailProvider = {};

EmailProvider.sendEmail = function(email) {
    return new Promise((resolve) => {
        emailTransporter.sendMail(email, function(error, info) {
            if (error) {
                resolve(EmailResponse.createFailureResponse(error));
            }
            else {
                resolve(EmailResponse.createSuccessfulResponse(info.response));
            }
        })
    })
}

EmailProvider.sendActivateJudgeEmail = function(judgeEmail, judgeName, judgeCode, activationToken) {
    let email = Email.createActivateJudgeEmail(judgeEmail, judgeName, judgeCode, activationToken);
    return EmailProvider.sendEmail(email);
}

module.exports = {EmailProvider};