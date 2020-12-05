const express = require('express')
//const jasminReq = require('../api/jasmin');
import {jasminReq} from ('../api/jasmin');
const router = express.Router();

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

module.exports = router