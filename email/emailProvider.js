const nodemailer = require("nodemailer");
const { EmailResponse } = require("../utils/responses/emailResponse");
const { Email } = require("./email");

let emailUser = process.env.EMAIL_USER;

let emailTransporter = nodemailer.createTransport({
    host : "smtp.gmail.com",
    port : 587,
    secure : false,
    auth : {
        user : emailUser,
        pass : process.env.EMAIL_APP_PASSWORD
    },
    tls : {
        rejectUnauthorized : false
    }
});

let EmailProvider = {};

EmailProvider.sendEmail = function(email) {
    return new Promise((resolve) => {
        emailTransporter.sendMail(email, function(error, info) {
            if (error) {
                resolve(EmailResponse.createFailureResponse(error.message));
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