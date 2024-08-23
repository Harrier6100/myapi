const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyToken = require('@/middlewares/verifyToken');
const Users = require('@/models/users');

/**
 * アカウント全件取得
 */
router.get('/', async (req, res, next) => {

    try {
        const users = await Users.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }

});

/**
 * アカウント取得
 */
router.get('/:id', async (req, res, next) => {

    const { id } = req.params;

    try {
        const user = await Users.findById(id);
        if (!user) return res.status(404).json();
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }

});

/**
 * アカウント追加
 */
router.post('/', verifyToken, async (req, res, next) => {

    const password = await bcrypt.hash(req.body.code, 10);

    try {
        const user = new Users();
        user.code = req.body.code;
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = password;
        user.expiryDate = req.body.expiryDate;
        user.createdAt = new Date();
        user.createdBy = req.userId;
        user.updatedAt = new Date();
        user.updatedBy = req.userId;

        const saved = await user.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }

});

/**
 * アカウント更新
 */
router.put('/:id', verifyToken, async (req, res, next) => {

    const { id } = req.params;

    try {
        const user = await Users.findById(id)
        if (!user) return res.status(404).send();

        user.code = req.body.code;
        user.name = req.body.name;
        user.email = req.body.email;
        user.expiryDate = req.body.expiryDate;
        user.updatedAt = new Date();
        user.updatedBy = req.userId;

        const saved = await user.save();
        res.status(200).json(saved);
    } catch (err) {
        next(err);
    }

});

/**
 * アカウント削除
 */
router.delete('/:id', verifyToken, async (req, res, next) => {

    const { id } = req.params;

    try {
        const removed = await Users.findByIdAndDelete(id);
        if (!removed) return res.status(404).send();
        res.status(200).json(removed);
    } catch (err) {
        next(err);
    }

});

module.exports = router;