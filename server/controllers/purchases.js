const { jasminReq } = require('../utils/request');
const { getTimestamp } = require('../utils/util');

const Controller = {};

Controller.purchases = (req, res) => {
  //TODO: purchases table
  const response = [];

  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        const supplier =
          invoice.sellerSupplierPartyName || invoice.sellerSupplierParty;

        invoice.documentLines.forEach((item) => {
          const getKey = (item) => item.itemKey;
          const getName = (item) => item.purchasesItem;
          const getDate = (item) => getTimestamp(item.deliveryDate);
          const getQuantity = (item) =>
            item.materialsItemWarehouses.reduce(
              (accumulator, currValue) => accumulator + currValue.stockBalance
            );
          const getUnitCost = (item) =>
            item.materialsItemWarehouses.reduce(
              (accumulator, currValue) =>
                accumulator + currValue.calculatedUnitCost
            ) / item.materialsItemWarehouses.length;

          const key = getKey(item);
          const name = getName(item);
          const date = getDate(item);
          const quantity = getQuantity(item);
          const unitCost = getUnitCost(item);

          response.push({
            key: key,
            name: name,
            supplier: supplier,
            date: date,
            quantity: quantity,
            unitCost: unitCost,
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
  //TODO: totalPurchases value
  const response = {
    value: 0,
  };

  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
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
  //TODO: debts table
  const response = [];

  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        //if (invoice.cashInvoice) continue; //todo fix 
        const supplier =
          invoice.sellerSupplierPartyName || invoice.sellerSupplierParty;

        invoice.documentLines.forEach((item) => {
          const getKey = (item) => item.itemKey;
          const getName = (item) => item.purchasesItem;
          const getDueDate = (item) => getTimestamp(item.dueDate);
          const getQuantity = (item) =>
            item.materialsItemWarehouses.reduce(
              (accumulator, currValue) => accumulator + currValue.stockBalance
            );
          const getUnitCost = (item) =>
            item.materialsItemWarehouses.reduce(
              (accumulator, currValue) =>
                accumulator + currValue.calculatedUnitCost
            ) / item.materialsItemWarehouses.length;

          const key = getKey(item);
          const name = getName(item);
          const dueDate = getDueDate(item);
          const quantity = getQuantity(item);
          const unitCost = getUnitCost(item);
          const totalCost = quantity * unitCost;

          response.push({
            key: key,
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
  //TODO: totalDebts value
  const response = {
    value: 0,
  };

  jasminReq('get', '/invoiceReceipt/invoices')
    .then((data) => {
      data.forEach((invoice) => {
        //if (invoice.cashInvoice) continue; //todo fix 
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
