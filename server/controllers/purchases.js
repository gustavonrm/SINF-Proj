const jasminReq = require('../utils/request');
const { getTimestamp } = require('../utils/util');

const Controller = {};

Controller.purchases = (req, res) => {
  const response = [];
  const year = req.params.year;
  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        if (year !== undefined && getTimestamp(invoice.documentDate).year !== year) return;
        const supplier = invoice.sellerSupplierPartyName;
        invoice.documentLines.forEach((item) => {
          const name = item.purchasesItem;
          const date = getTimestamp(item.deliveryDate);
          const quantity = item.quantity;
          const unitCost = item.unitPrice.amount;
          const totalCost = quantity * unitCost;
          response.push({
            name: name,
            supplier: supplier,
            date: date,
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

Controller.totalPurchases = (req, res) => {
  const response = { value: 0 };
  const year = req.params.year;
  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        if (year !== undefined && getTimestamp(invoice.documentDate).year !== year) return;
        response.value += invoice.payableAmount;
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

Controller.debts = (req, res) => {
  const response = [];
  const year = req.params.year;
  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        if (invoice.cashInvoice) return;
        if (year !== undefined && getTimestamp(invoice.documentDate).year !== year) return;
        const dueDate = getTimestamp(item.dueDate);
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

Controller.totalDebts = (req, res) => {
  const response = { value: 0 };
  const year = req.params.year;
  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => { 
        if (invoice.cashInvoice) return;
        if (year !== undefined && getTimestamp(invoice.documentDate).year !== year) return;
        response.value += invoice.payableAmount;
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
