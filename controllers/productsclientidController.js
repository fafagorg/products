'use strict'

var varproductsclientidController = require('./productsclientidControllerService');

module.exports.findproductsbyclient = function findproductsbyclient(req, res, next) {
  varproductsclientidController.findproductsbyclient(req.swagger.params, res, next);
};

module.exports.deleteAllClientProducts = function deleteAllClientProducts(req, res, next) {
  varproductsclientidController.deleteAllClientProducts(req.swagger.params, res, next);
};