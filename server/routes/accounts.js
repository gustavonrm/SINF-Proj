const { Router } = require('express');
const ctrl = require('../controllers/accounts');
const router = Router();

router.get('/accountsReceivable', ctrl.accountsReceivable);
//router.get('/receivableGraph', ctrl.receivableGraph); //TODO esta funcao nao esta definida
router.get('/accountsPayable', ctrl.accountsPayable);
//router.get('/payableGraph', ctrl.payableGraph);  //TODO esta funcao nao esta definida

module.exports = router;
