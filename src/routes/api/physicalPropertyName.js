const express = require('express');
const router = express.Router();
const verifyToken = require('@/middlewares/verifyToken');
const PhysicalPropertyNames = require('@/models/physicalPropertyNames');

/**
 * 物性マスタ
 */
router.get('/', async (req, res, next) => {

    try {
        const propertyNames = await PhysicalPropertyNames.find();
        res.status(200).json(propertyNames);
    } catch (err) {
        next(err);
    }

});

/**
 * 物性マスタ取得
 */
router.get('/:id', async (req, res, next) => {

    const { id } = req.params;

    try {
        const propertyName = await PhysicalPropertyNames.findById(id);
        if (!propertyName) return res.status(404).send();
        res.status(200).json(propertyName);
    } catch (err) {
        next(err);
    }

});

/**
 * 物性マスタ追加
 */
router.post('/', verifyToken, async (req, res, next) => {

    try {
        const propertyName = new PhysicalPropertyNames(req.body);
        propertyName.code = req.body.code;
        propertyName.name = req.body.name;
        propertyName.uom = req.body.uom;
        propertyName.numberSize = req.body.numberSize;
        propertyName.propertyNames = req.body.propertyNames;
        propertyName.remarks = req.body.remarks;
        propertyName.createdBy = req.userId;
        propertyName.createdAt = new Date();
        propertyName.updatedBy = req.userId;
        propertyName.updatedAt = new Date();
        const saved = await propertyName.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }

});

/**
 * 物性マスタ更新
 */
router.put('/:id', verifyToken, async (req, res, next) => {

    const { id } = req.params;

    try {
        const propertyName = await PhysicalPropertyNames.findById(id);
        if (propertyName) {
            propertyName.code = req.body.code;
            propertyName.name = req.body.name;
            propertyName.uom = req.body.uom;
            propertyName.numberSize = req.body.numberSize;
            propertyName.propertyName = req.body.propertyName;
            propertyName.remarks = req.body.remarks;
            propertyName.updatedBy = req.userId;
            propertyName.updatedAt = new Date();
            const saved = await propertyName.save();
            res.status(200).json(saved);
        } else {
            const propertyName = new PhysicalPropertyNames();
            propertyName._id = id;
            propertyName.code = req.body.code;
            propertyName.name = req.body.name;
            propertyName.uom = req.body.uom;
            propertyName.numberSize = req.body.numberSize;
            propertyName.propertyNames = req.body.propertyNames;
            propertyName.remarks = req.body.remarks;
            propertyName.createdBy = req.userId;
            propertyName.createdAt = new Date();
            propertyName.updatedBy = req.userId;
            propertyName.updatedAt = new Date();
            const saved = await propertyName.save();
            res.status(201).json(saved);
        }
    } catch (err) {
        next(err);
    }

});

/**
 * 物性マスタ削除
 */
router.delete('/:id', verifyToken, async (req, res, next) => {

    const { id } = req.params;

    try {
        const removed = await PhysicalPropertyNames.findByIdAndDelete(id);
        if (!removed) return res.status(404).send();
        res.status(200).json(removed);
    } catch (err) {
        next(err);
    }

});

module.exports = router;