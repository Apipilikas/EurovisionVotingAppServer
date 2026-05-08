const fs = require('fs');
const handlebars = require('handlebars');
const path = require('path');
const { EmailParams, Sender, Recipient, Attachment } = require("mailersend");

const imagesPath = path.join(__dirname, "images");

class Email {

    static emailUser = process.env.EMAIL_USER;

    attachments = []

    constructor(from, to, subject, html) {
        this.from = from;
        this.to = to;
        this.subject = subject;
        this.html = html;
    }

    toMailerSendParams() {
        const sentFrom = new Sender(this.from);
        const sentAttachments = this.attachments.map(attachment => attachment.toMailerSendParams());

        return new EmailParams()
        .setFrom(sentFrom)
        .setTo([new Recipient(this.to)])
        .setReplyTo(sentFrom)
        .setAttachments(sentAttachments)
        .setSubject(this.subject)
        .setHtml(this.html);
    }

    addEmbeddedImageAttachment(fileName, cid) {
        const imagePath = path.join(imagesPath, fileName);
        this.attachments.push(new EmailAttachment(fileName, imagePath, cid));
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

        const imagesPath = path.join(__dirname, "images");
        email.addEmbeddedImageAttachment("eurovision-logo.svg", "eurovision-logo");
        email.addEmbeddedImageAttachment("ferto-1.png", "ferto-1");
        email.addEmbeddedImageAttachment("ferto-2.png", "ferto-2");

        return email;
    }
}

class EmailAttachment {
    constructor(fileName, path, cid) {
        this.fileName = fileName;
        this.path = path;
        this.cid = cid;
    }

    toMailerSendParams() {
        const content = fs.readFileSync(this.path, {encoding: 'base64'});
        return new Attachment(content, this.fileName, "inline", this.cid);
    }
}

module.exports = {Email};