const { jasminReq } = require('../utils/request');

const Controller = {};

Controller.accountsReceivable = (req, res) => {
  saftReq('/accounts/accountsReceivable')
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
      const getKey = (item) => item.itemKey;
      const getName = (item) => item.salesItem;
      const getDueDate = (invoice) => getTimestamp(invoice.dueDate);
      const getQuantity = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.stockBalance
        );
      const getUnitCost = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.calculatedUnitCost
        ) / item.materialsItemWarehouses.length;

      const dueDate = getDueDate(invoice);
      data.forEach((invoice) => {
        if (invoice.cashInvoice) return; //TODO REVE ISTO PF - se isto é jQuery continue nao existe, comporta-se como return
        const supplier =
          invoice.buyerCustomerPartyName || invoice.buyerCustomerParty;

        invoice.documentLines.forEach((item) => {
          const key = getKey(item);
          const name = getName(item);
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

Controller.accountsPayable = (req, res) => {
  saftReq('/accounts/accountsPayable')
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
      const getKey = (item) => item.itemKey;
      const getName = (item) => item.purchasesItem;
      const getDueDate = (invoice) => getTimestamp(invoice.dueDate);
      const getQuantity = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.stockBalance
        );
      const getUnitCost = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.calculatedUnitCost
        ) / item.materialsItemWarehouses.length;

      data.forEach((invoice) => {
        if (invoice.cashInvoice) return; //TODO REVE ISTO PF - se isto é jQuery continue nao existe, comporta-se como return
        const supplier =
          invoice.sellerSupplierPartyName || invoice.sellerSupplierParty;

        const dueDate = getDueDate(invoice);
        invoice.documentLines.forEach((item) => {
          const key = getKey(item);
          const name = getName(item);
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

module.exports = Controller;
