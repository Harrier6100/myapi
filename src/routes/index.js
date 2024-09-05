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

module.exports = router;