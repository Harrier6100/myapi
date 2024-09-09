const express = require('express');
const router = express.Router();

/** サインイン */
router.use(
    require('./api/signin')
);

/** マイアカウント */
router.use('/me',
    require('./api/me')
);

/** アカウント */
router.use('/users',
    require('./api/user')
);

/** 物性マスタ */
router.use('/physical/property/names',
    require('./api/physicalPropertyName')
);

/** 原材料在庫 */
router.use('/material/stocks',
    require('./api/materialStock')
);

module.exports = router;