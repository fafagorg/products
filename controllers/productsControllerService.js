'use strict'
const { v4: uuidv4 } = require('uuid');

const ExchangeResource = require('../resources/exchangeResource.js')
const AuthResource = require('../resources/authResource.js')

const Product = require('../products');
const { response } = require('express');

module.exports.findProducts = function findProducts(req, res, next) {
    
    var min_price = req.min_price.value;
    var max_price = req.max_price.value;
    var keyWord = req.keyWord.value;
    var productCategory = req.productCategory.value;

    Product.find({},(err,products)=>{
      if (err){
          console.log(Date() + "-"+err);
          res.sendStatus(500);
      }else{
          var r = products;

          //PARAMS FILTERS
          if (keyWord){
              console.log("Keyword");
            r =  r.filter(p => p.name.includes(keyWord));
          }
          if (productCategory){
            console.log("Category");
            r = r.filter(p => p.category == productCategory);
          }
          if (min_price){
            console.log("Min Price");
            r = r.filter(p => p.price >= min_price);
          }
          if (max_price){
            console.log("Max price");
            r = r.filter(p => p.price <= max_price);
          }


          res.send(r.map((product)=>{
            return product.cleanup();
          }))

      }

});
};


module.exports.addProduct = function addProduct(req, res, next) {
  var product = req.undefined.value;
  var userId = product.seller;
  var token = res.req.headers.authorization.replace('Bearer ', '');
  AuthResource.auth(token).then( (response)=>{
    if (response.userId == userId){
      Product.find({},(err,products)=>{
        if(products.length === 0){
          product.id = 1;
        }else{
          product.id = Math.max(...products.map(p => {
            return p.id;
          })) +1;
        }
      
        Product.create(product,(err)=>{
          if (err){
              console.log(Date() + "-"+err);
              res.sendStatus(500);
          }else{
            res.status(201).send('Product created succesfully!');
          }
      });  
    })
    }else{
      res.status(409).send('You cannot add a product assigned to a different seller than the logged account');
    }
  })
  
};