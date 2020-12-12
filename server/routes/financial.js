const { Router } = require('express');
const ctrl = require('../controllers/financial');
const router = Router();

router.get('/returnRatios', ctrl.returnRatios); //fix - saft 
router.get('/financialStability', ctrl.financialStability); //fix - saft 
router.get('/liquidity', ctrl.liquidity); //fix - saft 
router.get('/growthRatios', ctrl.growthRatios); //fix - saft 

module.exports = router;
