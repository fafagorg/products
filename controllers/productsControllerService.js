'use strict'

module.exports.findProducts = function findProducts(req, res, next) {
  res.send({
    message: 'This is the mockup controller for findProducts'
  });
};

module.exports.addProduct = function addProduct(req, res, next) {
  res.send({
    message: 'This is the mockup controller for addProduct'
  });
};