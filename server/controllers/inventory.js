const jasminReq = require('../utils/request');
const { getTurnover, getQuantityMaterial, getUnitCostMaterial } = require('../utils/util');

const Controller = {};

Controller.stock = (req, res) => {
  const response = { value: 0 };
  jasminReq('get', '/materialsCore/materialsItems')
    .then((data) => {
      data.forEach((item) => {
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        response.value += quantity * unitCost;
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

Controller.capacity = (req, res) => {
  const response = [];
  Promise.all([
    jasminReq('get', '/materialsCore/materialsItems'),
    jasminReq('get', '/billing/invoices'),
  ])
    .then((data) => {
      data[0].forEach((item) => {
        
        const key = item.itemKey;
        const description = item.description; 
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        const turnover = getTurnover(key, quantity, unitCost, data[1]);
        const invPeriod = (turnover === 0) ? (-1) : (365/turnover);
        response.push({
          key: key,
          description: description,
          quantity: quantity,
          unitCost: unitCost,
          invPeriod: invPeriod,
          turnover: turnover,
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

Controller.period = (req, res) => {
  const response = { value: 0 };
  Promise.all([
    jasminReq('get', '/materialsCore/materialsItems'),
    jasminReq('get', '/billing/invoices'),
  ])
    .then((data) => {
      let totalStock = 0, totalSales = 0;
      data[0].forEach((item) => {
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        totalStock += quantity * unitCost;
      });
      data[1].forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const price = item.quantity * item.unitPrice.amount;
          totalSales += price;
        });
      });
      response.value = 365 / (totalSales / totalStock);
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

Controller.turnover = (req, res) => {
  const response = { value: 0 };
  Promise.all([
    jasminReq('get', '/materialsCore/materialsItems'),
    jasminReq('get', '/billing/invoices'),
  ])
    .then((data) => {
      let totalStock = 0, totalSales = 0;
      data[0].forEach((item) => {
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        totalStock += quantity * unitCost;
      });
      data[1].forEach((invoice) => {
        invoice.documentLines.forEach((item) => {
          const price = item.quantity * item.unitPrice.amount;
          totalSales += price;
        });
      });
      response.value = totalSales / totalStock;
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
