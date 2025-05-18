const {v4:uuid4} = require('uuid');

let UUIDUtils = {};

UUIDUtils.generateUUID = function() {
    return uuid4();
}

module.exports = {UUIDUtils}