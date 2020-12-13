const jasminReq = require('../utils/request');
const saftReq = require('../utils/saftReq');
const { getTimestamp } = require('../utils/util');

const Controller = {};

Controller.salesExpenses = (req, res) => {
  const response = { sales: [0,0,0,0,0,0,0,0,0,0,0,0], expenses: [0,0,0,0,0,0,0,0,0,0,0,0] };
  Promise.all([
    jasminReq('get', '/billing/invoices'),
    jasminReq('get', '/invoiceReceipt/invoices'),
  ])
    .then((data) => {
      const [salesInvoices, expensesInvoices] = data;
      salesInvoices.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate).month);
          const price = item.quantity * item.unitPrice.amount;
          response.sales[month - 1] += price;
        });
      });
      expensesInvoices.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate).month);
          const price = item.quantity * item.unitPrice.amount;
          response.expenses[month - 1] += price;
        });
      });
      res.json(response);
    })
    .catch(() => {
      const err = new Error('Failed');
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.assetsDebts = (req, res) => {
  Promise.all([saftReq('/assets'), saftReq('/debt')])
    .then((data) => {
      res.json({assets: data[0], debts: data[1]})
    })
    .catch(() => {
      const err = new Error('Failed');
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.totalAssets = (req, res) => {
  saftReq('/totalAssets')
    .then((data) => {
      res.json({value: data.value});
    })
    .catch(() => {
      const err = new Error('Failed');
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.totalDebts = (req, res) => {
  saftReq('/totalDebt')
    .then((data) => {
      res.json({value: data.value});
    })
    .catch(() => {
      const err = new Error('Failed');
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

module.exports = Controller;
