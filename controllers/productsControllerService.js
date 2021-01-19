'use strict'
const { v4: uuidv4 } = require('uuid');

const ExchangeResource = require('../resources/exchangeResource.js')

const Product = require('../products');

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