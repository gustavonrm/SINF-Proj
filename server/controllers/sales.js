const jasminReq = require('../utils/request');
const saftReq = require('../utils/saftReq');
const { getTimestamp } = require('../utils/util');

const Controller = {};

Controller.profit = (req, res) => {
  saftReq('/salesProfit').then((data) => {
      res.json({value: data.value});
    }).catch(() => {
      const err = new Error('Failed');
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.topProducts = (req, res) => {
  saftReq('/products')
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
  const response = { sales: [0,0,0,0,0,0,0,0,0,0,0,0] };
  jasminReq('get', '/billing/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const month = parseInt(getTimestamp(item.deliveryDate).month);
          const price = item.quantity * item.unitPrice.amount;
          response.sales[month - 1] += price;
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
