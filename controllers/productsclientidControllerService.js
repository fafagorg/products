'use strict'
const Product = require('../products');
const commons = require("../commons");
const AuthResource = require('../resources/authResource.js')


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
  var clientId = req.id.value.toString();
  console.log(clientId)

  var token = res.req.headers.authorization.replace('Bearer ', '');
  AuthResource.auth(token).then( (response)=>{
    console.log(response.userId);
    if (response.userId == clientId){
      /*Product.find({},(err,products)=>{
        products.filter(p => p.seller == clientId)*/
      //console.log(response)
      Product.deleteMany({"seller":clientId},(err, products)=>{
        if (err){
            console.log(Date() + "-"+err);
            res.sendStatus(500);
        }
        if (products.length == 0) {
          res.sendStatus(404);
        }
        else{
          res.status(200).send('Products of client: ' + clientId + ' deleted succesfully!');
        }
    });  
    }else{
      res.status(409).send('You cannot delete a product that you do not own');
    }
  })
}
  
  /*Product.deleteMany({  },(err, products) => {
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
};*/