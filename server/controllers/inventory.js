const jasminReq = require('../utils/request');
const saftReq = require('../utils/saftReq');
const { getQuantityMaterial, getUnitCostMaterial } = require('../utils/util');

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
  Promise.all([jasminReq('get', '/materialsCore/materialsItems'), saftReq('/products')])
    .then((data) => {
      const getTurnover = (key, quantity, unitCost) =>{
        if(data[1][key] == undefined) return 0;
        const sales = data[1][key].sales;
        const totalSales = sales.reduce((a,c) => a + c, 0);
        return totalSales / (quantity * unitCost);
      };

      data[0].forEach((item) => {
        const key = item.itemKey;
        const name = item.purchasesItem;
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        const turnover = getTurnover(key, quantity, unitCost);
        const invPeriod = 365 / turnover;
        response.push({
          key: key,
          name: name,
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
  Promise.all([jasminReq('get', '/materialsCore/materialsItems'), saftReq('/sales')])
    .then((data) => {
      let totalStock = 0, totalSales = 0;
      data[0].forEach((item) => {
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        totalStock += quantity * unitCost;
      });
      data[1].forEach((month) => {
        totalSales += month;
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
  Promise.all([jasminReq('get', '/materialsCore/materialsItems'), saftReq('/sales')])
    .then((data) => {
      let totalStock = 0, totalSales = 0;
      data[0].forEach((item) => {
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        totalStock += quantity * unitCost;
      });
      data[1].forEach((month) => {
        totalSales += month;
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
