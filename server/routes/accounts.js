const { Router } = require('express');
const ctrl = require('../controllers/accounts');
const router = Router();

router.get('/accountsReceivable', ctrl.accountsReceivable); //fix
router.get('/receivableTable', ctrl.receivableTable); //fix
router.get('/accountsPayable', ctrl.accountsPayable); //fix
router.get('/payableTable', ctrl.payableTable);  

module.exports = router;
