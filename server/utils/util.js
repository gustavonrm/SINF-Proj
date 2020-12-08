const getTimestamp = (date) => {
  // YYYY-DD-MM
  const match = date.match(/(\d{4})-(\d{2})-(\d{2})/);
  return { year: match[0], month: match[1], day: match[2] };
};

module.exports = {
  getTimestamp,
};
