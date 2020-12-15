const { Router } = require('express');
const ctrl = require('../controllers/purchases');
const router = Router();

router.get('/purchases/:year?', ctrl.purchases);
router.get('/totalPurchases/:year?', ctrl.totalPurchases);
router.get('/debts/:year?', ctrl.debts);
router.get('/totalDebts/:year?', ctrl.totalDebts);

module.exports = router;
