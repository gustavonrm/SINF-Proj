const { Router } = require('express');
const ctrl = require('../controllers/accounts');
const router = Router();

router.get('/accountsReceivable', ctrl.accountsReceivable);
router.get('/receivableTable', ctrl.receivableTable);
router.get('/accountsPayable', ctrl.accountsPayable);

router.get('/payableTable', ctrl.payableTable);  

module.exports = router;
