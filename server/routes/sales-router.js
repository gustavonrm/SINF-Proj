const express = require('express')
//const jasminReq = require('../api/jasmin');
const router = express.Router();
const profit = (req, res) => {
    //TODO: profit value
};

const topProducts = (req, res) => {
    //TODO: topProducts table
};

const totalSales = (req, res) => {
    //TODO: totalSales graph
};

router.get("/profit", profit);
router.get("/topProducts", topProducts);
router.get("/totalSales", totalSales);
module.exports = router