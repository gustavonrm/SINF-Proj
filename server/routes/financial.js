const { Router } = require('express');
const ctrl = require('../controllers/financial');
const router = Router();

router.get('/returnRatios', ctrl.returnRatios);
router.get('/financialStability', ctrl.financialStability);
router.get('/liquidity', ctrl.liquidity);
router.get('/growthRatios', ctrl.growthRatios);

module.exports = router;
