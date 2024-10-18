const { body } = require('express-validator');
exports.validateSignup = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name is required')
];

exports.validateSignin = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address'),
    body('password')
        .not()
        .isEmpty()
        .withMessage('Password is required')
];
