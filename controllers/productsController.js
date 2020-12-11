'use strict'

var varproductsController = require('./productsControllerService');

module.exports.findProducts = function findProducts(req, res, next) {
  varproductsController.findProducts(req.swagger.params, res, next);
};

module.exports.addProduct = function addProduct(req, res, next) {
  varproductsController.addProduct(req.swagger.params, res, next);
};