const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    console.log('Validate Error Middleware');
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validateRequest;
