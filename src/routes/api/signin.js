const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Users = require('@/models/users');
const secretKey = process.env.SECRET_KEY;
const refreshSecretKey = process.env.REFRESH_SECRET_KEY;

/**
 * サインイン
 */
router.post('/signin', async (req, res, next) => {

    const { id, password } = req.body;

    try {
        const user = await Users.findOne({ code: id });
        if (!user) return res.status(401).send('IDまたはパスワードが無効です。');

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).send('IDまたはパスワードが無効です。');

        const today = moment().startOf('day');
        const expiryDate = user.expiryDate ? moment(user.expiryDate).startOf('day') : null;
        if (expiryDate && expiryDate.isBefore(today)) {
            return res.status(401).send('アカウントの有効期限が切れています。');
        }

        const tokens = {
            user: { userId: user.code, userName: user.name },
            token: jwt.sign({ userId: user.code }, secretKey, { expiresIn: '1h' }),
            refreshToken: jwt.sign({ userId: user.code }, refreshSecretKey, { expiresIn: '7d' }),
        };

        res.status(200).json(tokens);
    } catch (err) {
        next(err);
    }

});

/**
 * トークンリフレッシュ
 */
router.post('/refresh', async (req, res, next) => {

    const { refreshToken } = req.body;

    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(refreshToken, refreshSecretKey, (err, decoded) => {
                if (err) return reject(err);
                resolve(decoded);
            });
        });

        const user = await Users.findOne({ code: decoded.userId });
        if (!user) return res.status(401).send('アカウントが存在しません。');

        const today = moment().startOf('day');
        const expiryDate = user.expiryDate ? moment(user.expiryDate).startOf('day') : null;
        if (expiryDate && expiryDate.isBefore(today)) {
            return res.status(401).send('アカウントの有効期限が切れています。');
        }

        const tokens = {
            user: { userId: user.code, userName: user.name },
            token: jwt.sign({ userId: user.code }, secretKey, { expiresIn: '1h' }),
            refreshToken: jwt.sign({ userId: user.code }, refreshSecretKey, { expiresIn: '7d' }),
        };

        res.status(200).json(tokens);
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send('トークンが無効です。');
        }
        next(err);
    }

});

module.exports = router;