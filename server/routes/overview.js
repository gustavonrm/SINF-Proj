const { Router } = require('express');
const ctrl = require('../controllers/overview');
const router = Router();

router.get('/salesExpenses',    ctrl.salesExpenses);
router.get('/assetsDebts',      ctrl.assetsDebts);
router.get('/totalAssets',      ctrl.totalAssets);
router.get('/totalDebts',       ctrl.totalDebts);

module.exports = router;