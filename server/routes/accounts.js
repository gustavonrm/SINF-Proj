const { Router } = require('express');
const ctrl = require('../controllers/accounts');
const router = Router();

router.get('/accountsReceivable',   ctrl.accountsReceivable);
router.get('/receivableGraph',      ctrl.receivableGraph);
router.get('/accountsPayable',      ctrl.accountsPayable);
router.get('/payableGraph',         ctrl.payableGraph);

module.exports = router;