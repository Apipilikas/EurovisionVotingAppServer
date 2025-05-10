class Email {

    static emailUser = process.env.EMAIL_USER;

    constructor(from, to, subject, html) {
        this.from = `ESCV 2025<${from}>`;
        this.to = to;
        this.subject = subject;
        this.html = html;
    }

    static createActivateJudgeEmail(judgeEmail, judgeName, judgeCode, activationToken) {
        let subject = "Activate judge account"
        let html = `<h2>Welcome to Eurovision Voting App 2025!</h2>
                    <p>Dear ${judgeName},<br/>
                    Please click on the link below to complete your registration.</p>
                    <a href=${process.env.CLIENT_URL}?judgeCode=${judgeCode}&&activationToken=${activationToken}>Register</a>
                    <h4>Thank you for registering!</h4>`
        return new Email(this.emailUser, judgeEmail, subject, html);
    }

    static createSuccessfulJudgeActivationEmail(to) {
        let subject = "Judge activated successfully"
        let html = `<h1>Great news!</h1>
                    <p>You activated your account! No you can procceed on sign in
                    through the register page or by clicking the link below</>
                    <h3>Happy eurovision-voting!</h3>`
    }
}

module.exports = {Email};