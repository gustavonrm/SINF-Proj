const { Router } = require('express');
const ctrl = require('../controllers/inventory');
const router = Router();

router.get('/stock',    ctrl.stock);
router.get('/capacity', ctrl.capacity);
router.get('/period',   ctrl.period);
router.get('/turnover', ctrl.turnover);

module.exports = router;