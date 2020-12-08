const { jasminReq } = require("../utils/request");

const Controller = {};

Controller.returnRatios = (req, res) => {
  Promise.all([saftReq("/financial/returnRatios/")])
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

Controller.financialStability = (req, res) => {
  Promise.all([saftReq("/financial/stability/")])
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

Controller.liquidity = (req, res) => {
  Promise.all([saftReq("/financial/liquidity/")])
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

Controller.growthRatios = (req, res) => {
  Promise.all([saftReq("/financial/growth/")])
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

module.exports = Controller;