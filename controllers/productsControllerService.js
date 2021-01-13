'use strict'
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
    Product.find({},(err,products)=>{
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