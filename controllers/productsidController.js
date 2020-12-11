'use strict'

var varproductsidController = require('./productsidControllerService');

module.exports.findproductbyid = function findproductbyid(req, res, next) {
  varproductsidController.findproductbyid(req.swagger.params, res, next);
};

module.exports.deleteProduct = function deleteProduct(req, res, next) {
  varproductsidController.deleteProduct(req.swagger.params, res, next);
};

module.exports.editProduct = function editProduct(req, res, next) {
  varproductsidController.editProduct(req.swagger.params, res, next);
};