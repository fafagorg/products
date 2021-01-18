'use strict'
const { v4: uuidv4 } = require('uuid');

const ExchangeResource = require('../resources/exchangeResource.js')

const Product = require('../products');

module.exports.findProducts = function findProducts(req, res, next) {
    /*var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);*/
    //console.log(req)
    
    var min_price = req.min_price.value;
    var max_price = req.max_price.value;
    var keyWord = req.keyWord.value;
    var productCategory = req.productCategory.value;
    //console.log("AAAAAAAAAAAAAAA: " + min_price + max_price + keyWord + productCategory);

    /*module.exports.addReview = function addReview(req, res, headers, next) {
      AuthResource.auth(headers.authorization).then((body) => {
        var keys = []
        for (var key in req.review.value) {
          keys.push(key);
        }
        if (keys.length === 0) {
          return res.status(400).send(getResponse(400, "Request body is missing."));
        }
        var review = new ReviewModel(req.review.value);
        review.id = uuidv4();
        review.dateCreated = new Date().toISOString();
        ReviewModel.create(review)
          .then(doc => {
            if (!doc || doc.length === 0) {
              return res.status(500).send(getResponse(500, "Unexpected error."));
            }
            res.status(201).send(getResponse(201, "Review created successfully."));
          })
          .catch(err => {
            res.status(500).send(getResponse(500, err));
          })
      }).catch((error) => {
        res.status(500).send(getResponse(500, error.error.err));
      });
    };*/

    Product.find({},(err,products)=>{
      ExchangeResource.requestExchange().then((response) =>{
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
        var divisas = response.rates.USD;
        console.log(divisas);
        console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
      if (err){
          console.log(Date() + "-"+err);
          res.sendStatus(500);
      }else{
          if (keyWord && productCategory && min_price && max_price){
              console.log("ALL PARAMS")
              var r = products.filter(p => p.price >= min_price && p.price <= max_price && p.category == productCategory && p.name.includes(keyWord));
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else if (keyWord != undefined){
              console.log("ONLY KEYWORD");
              var r = products.filter(p => p.name.includes(keyWord));
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else if (productCategory != undefined){
              console.log("ONLY CATEGORY");
              var r = products.filter(p => p.category == productCategory);
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else if (min_price && max_price){
              console.log("BOTH PRICES")
              var r = products.filter(p => (p.price >= min_price && p.price <= max_price));
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else if (min_price != undefined){
              console.log("ONLY MIN PRICE");
              var r = products.filter(p => (p.price >= min_price));
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else if (max_price != undefined){
              console.log("ONLY MAX PRICE");
              var r = products.filter(p => (p.price <= max_price));
              if (r.length > 0){
                res.send(r.map((product)=>{
                  return product.cleanup();
                }))
              }
              else{
                res.status(404).send("not found");
              }
          }
          else{
            console.log("NO PARAMS")
            if(products.length > 0){
              res.send(products.map((product)=>{
                return product.cleanup();
              }))
            }else{
              res.status(404).send("There aren't products in the store");
            }
          };
      }
  });
});
};

module.exports.addProduct = function addProduct(req, res, next) {
  var product = req.undefined.value;
  //console.log(req.undefined.value);
  //comprobacion de errores
  Product.create(product,(err)=>{
      if (err){
          console.log(Date() + "-"+err);
          res.sendStatus(500);
      }else{
        //res.send("Producto creado con éxito!");
        //res.sendStatus(201);
        res.status(201).send('Producto creado con éxito!');
      }
  });
};