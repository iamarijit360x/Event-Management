const { body, param } = require('express-validator');
const utilsService = require('../services/utilsService');

const validateDeleteService = [
    param('serviceId')
    .custom(value => {
        if (!utilsService.isObjectId(value)) {
            throw new Error('Invalid ObjectId.');
        }
        return true;
    })
];

module.exports = { validateDeleteService };
