'use strict'
const Product = require('../products');
const commons = require("../commons");

module.exports.findproductsbyclient = function findproductsbyclient(req, res, next) {
  var clientId = req.id.value;
  //console.log(req);
  console.log(Date() + " - GET a /products/client/clientId");
  Product.find({},(err,products)=>{
    //console.log(products);
    if (err){
        console.log(Date() + "-"+err);
        res.sendStatus(500);
    }else{
        //console.log(clientId);
        //console.log(products);
        var r = products.filter(p => p.seller == clientId);
        if (r.length > 0){
          res.send(r.map((product)=>{
            return product.cleanup();
          }));
        }else{
          res.status(404).send("not found");
        }
        
    }
});
};

module.exports.deleteAllClientProducts = function deleteAllClientProducts(req, res, next) {
  var clientId = req.id.value;

  /*if (!req.headers.authorization || req.headers.authorization == undefined) {
    next(new Error("Authentication error"));
  }

  try {
    let token = req.headers.authorization.replace('Bearer ', '');
    let decoded = await commons.decodedJWT(token)
    req.decoded = decoded;
    req.decoded.token = token;
    next();
  } catch (error) {
    console.log(error.response.data)
    return res.sendStatus(403);
  }*/

  //console.log(Date() + " - DELETE a /products/client/{id}");
  Product.deleteMany({ "seller": clientId },(err, products) => {
      if (err) {
        console.log(Date() + "-"+err);
      }
      if (products.length == 0) {
          res.sendStatus(404);
      }
      else {
        //res.send("Productos del cliente eliminado con éxito!")
        //res.sendStatus(200);
        res.status(200).send('Productos del cliente: ' + clientId + ' eliminado con éxito!');
      }
  });
};