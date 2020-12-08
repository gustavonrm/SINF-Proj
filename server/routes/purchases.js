const { Router } = require('express');
const ctrl = require('../controllers/purchases');
const router = Router();

router.get('/purchases', ctrl.purchases);
router.get('/totalPurchases', ctrl.totalPurchases);
router.get('/debts', ctrl.debts);
router.get('/totalDebts', ctrl.totalDebts);

module.exports = router;
