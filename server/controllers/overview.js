const jasminReq = require('../utils/request');
const { getTimestamp } = require('../utils/util');
const saftReq = require('../utils/saftReq');

const Controller = {};

Controller.salesExpenses = (req, res) => {
  const sales = [];
  sales.fill(0, 0, 11);
  const expenses = [];
  expenses.fill(0, 0, 11);
  const response = { sales: sales, expenses: expenses };

  Promise.all([
    jasminReq('get', '/billing/invoices'),
    jasminReq('get', '/invoiceReceipt/invoices'),
  ])
    .then((data) => {
      const [salesInvoices, expensesInvoices] = data;

      salesInvoices.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate));
          const price = item.quantity * item.unitPrice;
          sales[month - 1] += price;
        });
      });

      expensesInvoices.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate));
          const price = item.quantity * item.unitPrice;
          expenses[month - 1] += price;
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
