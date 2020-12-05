const { Router } = require('express');
const { jasminReq } = require('../utils/request');
const router = Router();

const profit = (req, res) => {
    //TODO: profit value
};

const topProducts = (req, res) => {
    //TODO: topProducts table
};

const totalSales = (req, res) => {
    //TODO: totalSales graph
    const sales = []; sales.fill(0, 0, 11);
    const expenses = []; expenses.fill(0, 0, 11);
    const response = { sales: sales, expenses: expenses };

    jasminReq('get', '/billing/invoices').then((data) => {
        date.forEach((invoice) => {
            invoice.documentLines.forEach((product) => {
                const month = parseInt(getTimestamp(product.deliveryDate));
                const price = product.quantity * product.unitPrice;
                sales[month-1] += price;
            });
        });

        res.json(response);
    }).catch(() => {
        const err = new Error('Failed');
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
};

router.get('/profit', profit);
router.get('/topProducts', topProducts);
router.get('/totalSales', totalSales);

module.exports = router;