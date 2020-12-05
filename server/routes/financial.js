const { Router } = require('express');
const { jasminReq } = require('../utils/request');
const router = Router();

const returnRatios = (req, res) => {
    //TODO: returnRatios graph
};

const financialStability = (req, res) => {
    //TODO: financialStability graph
};

const liquidity = (req, res) => {
    //TODO: liquidity graph
};

const growthRatios = (req, res) => {
    //TODO: growthRatios graph
};

router.get('/returnRatios', returnRatios);
router.get('/financialStability', financialStability);
router.get('/liquidity', liquidity);
router.get('/growthRatios', growthRatios);

module.exports = router;