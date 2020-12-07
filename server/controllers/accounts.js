const { jasminReq } = require("../utils/request");

const Controller = {};

Controller.accountsReceivable = (req, res) => {
  saftReq("/accounts/accountsReceivable")
    .then((data) => {
      res.json({value: data.total, percentage: data.percentage});
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

Controller.receivableGraph = (req, res) => {
  //TODO
};

Controller.accountsPayable = (req, res) => {
  saftReq("/accounts/accountsPayable")
    .then((data) => {
      res.json({value: data.total, percentage: data.percentage});
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

Controller.payableGraph = (req, res) => {
  //TODO
};

module.exports = Controller;
