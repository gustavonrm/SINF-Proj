const { jasminReq } = require("../utils/request");

const Controller = {};

Controller.accountsReceivable = (req, res) => {
  Promise.all([saftReq("/accounts/accountsReceivable/")])
    .then((data) => {
      res.json(response);
    })
    .catch(() => {
      const err = new Error("Failed");
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.receivableTable = (req, res) => {
  const response = [];

  jasminReq("get", "/invoiceReceipt/invoices")
    .then((data) => {
      data.forEach((invoice) => {
        if (invoice.cashInvoice) continue;
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
      const err = new Error("Failed");
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.accountsPayable = (req, res) => {
  Promise.all([saftReq("/accounts/accountsPayable/")])
    .then((data) => {
      res.json(response);
    })
    .catch(() => {
      const err = new Error("Failed");
      err.status = 400;
      res.status(400).json({
        message: err.message,
        error: err,
      });
    });
};

Controller.payableTable = (req, res) => {
  //TODO: payableGraph graph
};

module.exports = Controller;
