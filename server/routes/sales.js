const { Router } = require('express');
const ctrl = require('../controllers/sales');
const router = Router();

router.get('/profit',       ctrl.profit);
router.get('/topProducts',  ctrl.topProducts);
router.get('/totalSales',   ctrl.totalSales);

module.exports = router;