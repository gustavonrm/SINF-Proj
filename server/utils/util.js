const getTimestamp = (date) => {
  // YYYY-DD-MM
  const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
  return { year: match[0], month: match[1], day: match[2] };
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

module.exports = {
  getTimestamp,
  getQuantityMaterial,
  getUnitCostMaterial,

};
