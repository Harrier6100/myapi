const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('@/middlewares/verifyToken');
const Users = require('@/models/users');

/**
 * マイアカウント
 */
router.get('/', verifyToken, async (req, res, next) => {

    try {
        const user = await Users.findOne({ code: req.userId });
        if (!user) return res.status(404).send();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }

});

/**
 * マイアカウント更新 - パスワード変更
 */
router.put('/password', verifyToken, async (req, res, next) => {

    try {
        const user = await Users.findOne({ code: req.userId });
        if (!user) return res.status(404).send();
        user.password = await bcrypt.hash(req.body.password, 10);
        const saved = await user.save();
        res.status(200).json(saved);
    } catch (err) {
        next(err);
    }

});

module.exports = router;