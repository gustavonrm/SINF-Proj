const { Router } = require('express');
const ctrl = require('../controllers/inventory');
const router = Router();

router.get('/stock', ctrl.stock); 
router.get('/capacity', ctrl.capacity);         // TODO: fix 
router.get('/period', ctrl.period);             // TODO: fix
router.get('/turnover', ctrl.turnover);         // TODO: fix

module.exports = router;
