'use strict'
const Product = require('../products');

module.exports.findProducts = function findProducts(req, res, next) {
    Product.find({},(err,products)=>{
      if (err){
          console.log(Date() + "-"+err);
          res.sendStatus(500);
      }else{
          res.send(products.map((product)=>{
              return product.cleanup();
          }));
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