const { jasminReq } = require("../utils/request");
const saftReq = require("../utils/saftReq");

const Controller = {};

Controller.stock = (req, res) => {
  // Returns the list of all the entity records available.
  jasminReq("get", "/materialsCore/materialsItems")
    .then((data) => {
      const response = {
        value: 0,
      };

      const getQuantity = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.stockBalance
        );

      const getUnitCost = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.calculatedUnitCost
        ) / item.materialsItemWarehouses.length;

      data.forEach((item) => {
        const quantity = getQuantity(item);
        const unitCost = getUnitCost(item);
        response.value += quantity * unitCost;
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

Controller.capacity = (req, res) => {
  // Returns the list of all the entity records available.
  Promise.all([jasminReq("get", "/materialsCore/materialsItems"), saftReq("/products/")])
    .then((data) => {
      const response = [];

      const getKey = (item) => item.itemKey;

      const getName = (item) => item.purchasesItem;

      const getQuantity = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.stockBalance
        );

      const getUnitCost = (item) =>
        item.materialsItemWarehouses.reduce(
          (accumulator, currValue) => accumulator + currValue.calculatedUnitCost
        ) / item.materialsItemWarehouses.length;

      const getInvPeriod = (item) => 365 / getTurnover(item)

      const getTurnover = (item) =>{
        const totalStockValue = getQuantity(item) * getUnitCost(item)
        const product = data[1][getKey(item)]
        const sales = product.sales
        let totalSales = 0
        sales.forEach((month) => {totalSales += month})

        return totalSales / totalStockValue;
      }

      data[0].forEach((item) => {
        const key = getKey(item);
        const name = getName(item);
        const quantity = getQuantity(item);
        const unitCost = getUnitCost(item);
        const invPeriod = getInvPeriod(item);
        const turnover = getTurnover(item);

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
      const err = new Error("Failed");
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
      saftReq("/overview/sales/")
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
