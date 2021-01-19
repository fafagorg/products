'use strict'

var varratesController = require('./ratesControllerService');

module.exports.getRates = function getRates(req, res, next) {
  varratesController.getRates(req.swagger.params, res, next);
};
