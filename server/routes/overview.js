const { Router } = require('express');
const ctrl = require('../controllers/overview');
const router = Router();

router.get('/salesExpenses', ctrl.salesExpenses);
router.get('/assetsDebts', ctrl.assetsDebts); //fix saft
router.get('/totalAssets', ctrl.totalAssets); //fix saft
router.get('/totalDebts', ctrl.totalDebts);//fix saft

module.exports = router;
