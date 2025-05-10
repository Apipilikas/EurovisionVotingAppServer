class EmailResponse {
    constructor(success, info) {
        this.success = success;
        this.info = info;
    }

    static createSuccessfulResponse(info) {
        return new EmailResponse(true, info);
    }

    static createFailureResponse(error) {
        return new EmailResponse(false, error);
    }
}

module.exports = {EmailResponse};