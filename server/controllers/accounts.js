const jasminReq = require('../utils/request');
const saftReq = require('../utils/saftReq');
const { getTimestamp } = require('../utils/util');

const Controller = {};

Controller.accountsReceivable = (req, res) => {
  saftReq('/accountsReceivable')
    .then((data) => {
      res.json({ value: data.total, percentage: data.percentage });
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

Controller.receivableTable = (req, res) => {
  const response = [];
  jasminReq('get', '/billing/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        if (invoice.cashInvoice) return;
        const dueDate = getTimestamp(invoice.dueDate);
        const supplier = invoice.buyerCustomerPartyName;
        invoice.documentLines.forEach((item) => {
          const name = item.salesItem;
          const quantity = item.quantity;
          const unitCost = item.unitPrice.amount;
          const totalCost = quantity * unitCost;
          response.push({
            name: name,
            supplier: supplier,
            dueDate: dueDate,
            quantity: quantity,
            unitCost: unitCost,
            totalCost: totalCost,
          });
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

Controller.accountsPayable = (req, res) => {
  saftReq('/accountsPayable')
    .then((data) => {
      res.json({ value: data.total, percentage: data.percentage });
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

Controller.payableTable = (req, res) => {
  const response = [];
  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      for(const k in data) console.log(k + "  " + data[k]);
      data.forEach((invoice) => {
        if (invoice.cashInvoice) return;
        const dueDate = getTimestamp(invoice.dueDate);
        const supplier = invoice.sellerSupplierPartyName;
        invoice.documentLines.forEach((item) => {
          const name = item.purchasesItem;
          const quantity = item.quantity;
          const unitCost = item.unitPrice.amount;
          const totalCost = quantity * unitCost;

          response.push({
            name: name,
            supplier: supplier,
            dueDate: dueDate,
            quantity: quantity,
            unitCost: unitCost,
            totalCost: totalCost,
          });
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
