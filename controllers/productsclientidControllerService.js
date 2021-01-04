'use strict'
const Product = require('../products');

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
        
        res.send(products.filter(p => p.seller == clientId).map((product)=>{
            return product.cleanup();
        }));
    }
});
};

module.exports.deleteAllClientProducts = function deleteAllClientProducts(req, res, next) {
  var clientId = req.id.value;
  //console.log(Date() + " - DELETE a /products/client/{id}");
  Product.deleteMany({ "seller": clientId },(err, products) => {
      if (err) {
        console.log(Date() + "-"+err);
      }
      if (products.length == 0) {
          res.sendStatus(404);
      }
      else {
        res.send("Productos del cliente eliminado con éxito!")
        //res.sendStatus(200);
      }
  });
};