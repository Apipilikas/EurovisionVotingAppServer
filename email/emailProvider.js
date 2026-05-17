const nodemailer = require("nodemailer");
const { EmailResponse } = require("../utils/responses/emailResponse");
const { Email } = require("./email");
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

let EmailProvider = {};

EmailProvider.sendEmail = function(emailParams) {
    const mailerSend = new MailerSend({
        apiKey: process.env.EMAIL_APP_PASSWORD,
    });

    return new Promise((resolve) => {
        mailerSend.email.send(emailParams).then(response => {
            if (response.statusCode >= 200 && response.statusCode < 300) {
                resolve(EmailResponse.createSuccessfulResponse(response.body));
            }
            else {
                resolve(EmailResponse.createFailureResponse(response.body));
            }
        })
        .catch(e => {
            resolve(EmailResponse.createFailureResponse(e.body.message))});
    })
}

EmailProvider.sendActivateJudgeEmail = function(judgeEmail, judgeName, judgeCode, activationToken) {
    let emailParams = Email.createActivateJudgeEmail(judgeEmail, judgeName, judgeCode, activationToken).toMailerSendParams();
    return EmailProvider.sendEmail(emailParams);
}

module.exports = {EmailProvider};