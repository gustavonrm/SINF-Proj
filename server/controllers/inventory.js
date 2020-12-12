const jasminReq = require('../utils/request');
const saftReq = require('../utils/saftReq');
const { getQuantityMaterial, getUnitCostMaterial } = require('../utils/util');

const Controller = {};

Controller.stock = (req, res) => {
  // Returns the list of all the entity records available.
  jasminReq('get', '/materialsCore/materialsItems')
    .then((data) => {
      let response = {
        value: 0,
      };
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
  // Returns the list of all the entity records available.
  Promise.all([jasminReq('get', '/materialsCore/materialsItems'), saftReq('/products')])
    .then((data) => {
      const response = [];
      const getTurnover = (key, quantity, unitCost) =>{
        const sales = data[1][key].sales;
        const totalSales = sales.reduce((a,c) => a + c);
        return totalSales / (quantity * unitCost);
      };

      data[0].forEach((item) => {
        const key = item.itemKey;
        const name = item.purchasesItem;
        const quantity = getQuantityMaterial(item);
        const unitCost = getUnitCostMaterial(item);
        const turnover = getTurnover(key, quantity, unitCost);
        const invPeriod = 365 / turnover;
        console.log("pos");

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
  Controller.turnover()
    .then((result) => {
      const turnover = result.value
      const period = 365 / turnover
      res.json({value: period})
    });
};

Controller.turnover = (req, res) => {
  Controller.capacity()
    .then((data) => {
      saftReq('/overview/sales')
        .then((monthlySales) => {
          let totalStock = 0 
          data.forEach((product) => {
            totalStock += product.unitCost * product.quantity
          })

          let totalSales = 0
          monthlySales.forEach((month) => {
            totalSales += month
          })

          const turnover = totalSales / totalStock 
          res.json({value: turnover})
        });
    });
};

module.exports = Controller;
