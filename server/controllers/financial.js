const saftReq = require('../utils/saftReq');

const Controller = {};

Controller.returnRatios = (req, res) => {
  saftReq('/returnRatios')
    .then((data) => {
      res.json(data);
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

Controller.financialStability = (req, res) => {
  saftReq('/stability')
    .then((data) => {
      res.json(data);
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

Controller.liquidity = (req, res) => {
  saftReq('/liquidity')
    .then((data) => {
      res.json(data);
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

Controller.growthRatios = (req, res) => {
  saftReq('/growth')
    .then((data) => {
      res.json(data);
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

Controller.balanceSheet = (req, res) => {
  saftReq('/balanceSheet')
    .then((data) => {
      res.json(data);
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
