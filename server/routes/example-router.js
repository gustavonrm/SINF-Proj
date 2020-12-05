const express = require('express')
//const jasminReq = require('../api/jasmin');
const router = express.Router();

const example = (req, res) => {
    jasminReq('get', 'url').then((data) => {
        const response = {

        };

        res.json(response);
    }).catch(() => {
        const err = new Error("Failed");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
}

router.get("/", example)

module.exports = router