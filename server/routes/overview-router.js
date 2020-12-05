const { Router } = require('express');
const { jasminReq } = require('../api/jasmin');
const { getTimestamp } = require('../utils/util');
const router = Router();

const salesExpenses = (req, res) => {
    const sales = []; sales.fill(0, 0, 11);
    const expenses = []; expenses.fill(0, 0, 11);
    const response = { sales: sales, expenses: expenses };

    Promise.all([
        jasminReq('get', '/billing/invoices'),
        jasminReq('get', '/invoiceReceipt/invoices')
    ]).then((data) => {
        const [salesInvoices, expensesInvoices] = data;

        salesInvoices.forEach((invoice) => {
            invoice.documentLines.forEach((product) => {
                const month = parseInt(getTimestamp(product.deliveryDate));
                const price = product.quantity * product.unitPrice;
                sales[month-1] += price;
            });
        });

        expensesInvoices.forEach((invoice) => {
            invoice.documentLines.forEach((product) => {
                const month = parseInt(getTimestamp(product.deliveryDate));
                const price = product.quantity * product.unitPrice;
                expenses[month-1] += price;
            });
        });

        res.json(response);
    }).catch(() => {
        const err = new Error("Failed");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
};

const assetsDebts = (req, res) => {
    const assets = []; assets.fill(0, 0, 11);
    const debts = []; debts.fill(0, 0, 11);
    const response = { assets: assets, expenses: expenses };

    Promise.all([
        
    ]).then((data) => {
        

        res.json(response);
    }).catch(() => {
        const err = new Error("Failed");
        err.status = 400;
        res.status(400).json({
            message: err.message,
            error: err
        });
    });
};

const totalAssets = (req, res) => {
    //TODO: totalAssets SAFT value
};

const totalDebts = (req, res) => {
    //TODO: totalDebts SAFT value
};

router.get("/salesExpenses", salesExpenses);
router.get("/assetsDebts", assetsDebts);
router.get("/totalAssets", totalAssets);
router.get("/totalDebts", totalDebts);

module.exports = router;
