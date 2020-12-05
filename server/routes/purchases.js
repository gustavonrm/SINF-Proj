const { Router } = require('express');
const { jasminReq } = require('../api/jasmin');
const router = Router();

const purchases = (req, res) => {
    //TODO: purchases table
};

const totalPurchases = (req, res) => {
    //TODO: totalPurchases value
};

const debts = (req, res) => {
    //TODO: debts table
};

const totalDebts = (req, res) => {
    //TODO: totalDebts value
};

router.get("/purchases", purchases);
router.get("/totalPurchases", totalPurchases);
router.get("/debts", debts);
router.get("/totalDebts", totalDebts);

module.exports = router;