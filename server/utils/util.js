const getTimestamp = (date) => {
  const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
  return { year: match[1], month: match[2], day: match[3] };
};

const getQuantityMaterial = (item) =>
  item.materialsItemWarehouses.reduce(
    (accumulator, currValue) => accumulator + currValue.stockBalance, 0
  );

const getUnitCostMaterial = (item) => 
  item.materialsItemWarehouses.reduce(
    (accumulator, currValue) =>
      accumulator + currValue.calculatedUnitCost.amount, 0
  ) / item.materialsItemWarehouses.length;

const getTurnover = (key, quantity, unitCost) => {
  let totalSales = 0;
  data[1].forEach((invoice) => {
    invoice.documentLines.forEach((item) => {
      if(key != item.salesItem) return;
      const price = item.quantity * item.unitPrice.amount;
      totalSales += price;
    });
  });
  return totalSales / (quantity * unitCost);
};

module.exports = {
  getTimestamp,
  getQuantityMaterial,
  getUnitCostMaterial,
  getTurnover,
};
