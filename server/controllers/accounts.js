const { jasminReq } = require("../utils/request");

const Controller = {};

Controller.accountsReceivable = (req, res) => {
  Promise.all([saftReq("/accounts/accountsReceivable/")])
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

Controller.receivableGraph = (req, res) => {
  //TODO: receivableGraph graph
};

Controller.accountsPayable = (req, res) => {
  Promise.all([saftReq("/accounts/accountsPayable/")])
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

Controller.payableGraph = (req, res) => {
  //TODO: payableGraph graph
};

module.exports = Controller;
