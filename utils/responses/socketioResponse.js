var util = require('util');

/**
 * This class is used for the communication between the two sides of the socket.
 */
class SocketIOResponse {
    /**
     * SocketIOResponse constructor
     * @param {object} data The sent data
     * @param {object} message The socketio message
     */
    constructor(data, message) {
        this.data = data;
        this.message = message;
    }

    /**
     * Creates a SocketIOResponse instance. Message will be formatted based on the params.
     * @param {object} data The sent data
     * @param {string} message The unformatted message
     * @param  {...string} params The params that will replace the message.
     * @returns {SocketIOResponse}
     */
    static create(data, message, ...params) {
        let formattedMessage = util.format(message, ...params);

        let response = new SocketIOResponse(data, formattedMessage);
        return response;
    }

    /**
     * Converts the object to json.
     * @returns {object}
     */
    toJSON() {
        return {data : this.data, message : this.message};
    }
}

module.exports = {SocketIOResponse}