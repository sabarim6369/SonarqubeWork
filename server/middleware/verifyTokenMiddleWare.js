const jwt = require('jsonwebtoken');

const verifyTokenMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Invalid token:', error);
        return res.status(400).send('Invalid token.');
    }
};

module.exports = verifyTokenMiddleware;
