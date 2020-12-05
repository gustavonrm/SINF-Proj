const { Router } = require('express');
const { jasminReq } = require('../api/jasmin');
const router = Router();

const accountsReceivable = (req, res) => {
    //TODO: accountsReceivable value
};

const receivableGraph = (req, res) => {
    //TODO: receivableGraph graph
};

const accountsPayable = (req, res) => {
    //TODO: accountsPayable value
};

const payableGraph = (req, res) => {
    //TODO: payableGraph graph
};

router.get("/accountsReceivable", accountsReceivable);
router.get("/receivableGraph", receivableGraph);
router.get("/accountsPayable", accountsPayable);
router.get("/payableGraph", payableGraph);

module.exports = router;
