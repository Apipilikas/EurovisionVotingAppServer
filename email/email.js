const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');

class Email {

    static emailUser = process.env.EMAIL_USER;

    attachments = []

    constructor(from, to, subject, html) {
        this.from = `ESCV 2026<${from}>`;
        this.to = to;
        this.subject = subject;
        this.html = html;
    }

    addEmbeddedImageAttachment(fileName, path, cid) {
        this.attachments.push(new EmailAttachment(fileName, path, cid));
    }

    static createActivateJudgeEmail(judgeEmail, judgeName, judgeCode, activationToken) {
        const subject = "Activate judge account";
        const filePath = path.join(__dirname, "templates", "activateJudge.html");
        const html = fs.readFileSync(filePath, "utf-8").toString();

        const template = handlebars.compile(html);

        const data = {
            clientUrl : process.env.CLIENT_URL,
            judgeName : judgeName,
            judgeCode : judgeCode,
            activationToken : activationToken
        }

        const content = template(data);
        let email = new Email(this.emailUser, judgeEmail, subject, content);

        const imageFilePath = path.join(__dirname, "images", "eurovision-logo.png");
        email.addEmbeddedImageAttachment("eurovision-logo.png", imageFilePath, "eurovision-logo");

        return email;
    }
}

class EmailAttachment {
    constructor(fileName, path, cid) {
        this.fileName = fileName;
        this.path = path;
        this.cid = cid;
    }
}

module.exports = {Email};