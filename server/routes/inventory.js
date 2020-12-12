const { Router } = require('express');
const ctrl = require('../controllers/inventory');
const router = Router();

router.get('/stock', ctrl.stock); //return null 
router.get('/capacity', ctrl.capacity); //fix 
router.get('/period', ctrl.period); //fix para nodemon 
router.get('/turnover', ctrl.turnover); //fix para nodemon 

module.exports = router;
