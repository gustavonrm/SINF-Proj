const express = require('express')
//const jasminReq = require('../api/jasmin');
const router = express.Router();

const salesExpenses = (req, res) => {
    //TODO: salesExpenses graph
};

const assetsDebts = (req, res) => {
    //TODO: assetsDebts graph
};

const totalAssets = (req, res) => {
    //TODO: totalAssets value
};

const totalDebts = (req, res) => {
    //TODO: totalDebts value
};

router.get("/salesExpenses", salesExpenses);
router.get("/assetsDebts", assetsDebts);
router.get("/totalAssets", totalAssets);
router.get("/totalDebts", totalDebts);

module.exports = router