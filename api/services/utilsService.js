const jwt = require('jsonwebtoken');
const { isValidObjectId } = require('mongoose'); 

class UtilityService {
    isObjectId(id) {
        return isValidObjectId(id);
    }
}

module.exports = new UtilityService();
