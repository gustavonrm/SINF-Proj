const { jasminReq } = require('../utils/request');

const Controller = {};

Controller.profit = (req, res) => {
  saftReq('/salesProfit/')
    .then((data) => {
      res.json({value: data});
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

Controller.topProducts = (req, res) => {
  saftReq('/products/')
    .then((data) => {
      res.json(data);
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

Controller.totalSales = (req, res) => {
  const sales = [];
  sales.fill(0, 0, 11);
  const expenses = [];
  expenses.fill(0, 0, 11);
  const response = { sales: sales, expenses: expenses };

  jasminReq('get', '/billing/invoices')
    .then((data) => {
      date.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate));
          const price = item.quantity * item.unitPrice;
          sales[month - 1] += price;
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

module.exports = Controller;