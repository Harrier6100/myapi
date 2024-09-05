const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

module.exports = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(400).send('サインインしてください。');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('トークンが無効です。');
        req.userId = decoded.userId;
        req.userName = decoded.userName;
        next();
    });
};