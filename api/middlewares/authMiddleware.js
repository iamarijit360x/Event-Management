const jwt = require('jsonwebtoken');

exports.verifyUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization') || '';
        if (!token) {
            return res.status(401).json({
                message: 'You need to login first',
                error: 'Unauthorized'
            });
        }
        try {
            const decoded = jwt.verify(token, process.env.SECRET);
            req.userId = decoded.id;
            req.isAdmin = !!decoded.isAdmin;
            return next();
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized. You need to login' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.verifyAdmin = async (req, res, next) => {
    if (req.isAdmin === true) {
        return next();
    }

    return res.status(403).json({ message: 'Admin Access Required' });
};
