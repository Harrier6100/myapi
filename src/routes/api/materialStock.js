const express = require('express');
const router = express.Router();
const db = require('@/modules/db');

/**
 * 原材料在庫
 */
router.get('/', async (req, res, next) => {

    let field = '*';
    field = req.query.field ?? field;

    let find = '1=1';
    find += req.query.code ? ' and code like any (to_array(${code}))' : '';
    find += req.query.name ? ' and name like any (to_array(${name}))' : '';
    find += req.query.lot ? ' and lot like any (to_array(${lot}))' : '';
    find += req.query.width ? ' and width = ${width}' : '';
    find += req.query.length ? ' and length = ${length}' : '';
    find += req.query.warehouse_code ? ' and warehouse_code like any (to_array(${warehouse_code}))' : '';
    find += req.query.stock_status_class ? ' and stock_status_class like any (to_array(${stock_status_class}))' : '';
    find += req.query.received_from ? ' and received >= ${received_from}' : '';
    find += req.query.received_to ? ' and received <= ${received_to}' : '';
    find += ['true','on','1'].some(em => em === req.query.is_volume) ? '' : " and volume != 0";

    let sort = 'code, barcode';
    sort = req.query.sort ?? sort;

    try {
        const materialStocks = await db.any(`
            select ${field} from material_stocks
                where ${find} order by ${sort}
        `, req.query);
        res.status(200).json(materialStocks);
    } catch (err) {
        next(err);
    }

});

/**
 * 原材料在庫
 */
router.get('/:lot', async (req, res, next) => {

    try {
        const materialStock = await db.one(`
            select * from material_stocks
                where lot = \${lot}
        `, req.params);
        res.status(200).json(materialStock);
    } catch (err) {
        next(err);
    }

});

/**
 * 原材料在庫
 */
router.get('/:code/:lot', async (req, res, next) => {

    try {
        const materialStock = await db.one(`
            select * from material_stocks
                where code = \${code}
                    and lot = \${lot}
        `, req.params);
        res.status(200).json(materialStock);
    } catch (err) {
        next(err);
    }

});

module.exports = router;