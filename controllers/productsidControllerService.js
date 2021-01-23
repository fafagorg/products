'use strict'
const Product = require('../products');
const commons = require("../commons");
const AuthResource = require('../resources/authResource.js')

module.exports.findproductbyid = function findproductbyid(req, res, next) {
  var productId = req.id.value;
  console.log(Date() + " - GET a /products/productId");
  Product.find({},(err,products)=>{
    if (err){
        console.log(Date() + "-"+err);
        res.sendStatus(500);
    }else{
      var r = products.filter(p => p.id == productId);
      if (r.length > 0){
        res.send(r.map((product)=>{
          /*let p = product.cleanup();
          p.reviews = reviews
          return p;*/
          return product.cleanup();
        }));
      }else{
        res.status(404).send("not found");
      }
      //let reviews = commons.reviewProduct(productId);
      
    }
});
};

//OJO, SI HAY VARIOS PRODUCTOS CON EL MISMO ID, SÓLO BORRA UNO. NO DEBERÍA PASAR, PQ SOLO DEBERIA HABER UN PRODUCTO POR ID
module.exports.deleteProduct = function deleteProduct(req, res, next) {
  var productId = req.id.value;
  var token = res.req.headers.authorization.replace('Bearer ', '');
  console.log(Date() + " - DELETE a /products/{id}");

  var product = Product.find({id: productId}, (err, products) => {
      if (products.length != 0){
        console.log(products)
          var seller = products[0].seller;
          AuthResource.auth(token).then( (response, error)=>{
            console.log(response.userId)
                  if (seller === response.userId){      
                    Product.deleteOne({id: productId}, (err, products) => {
                          if (err) {
                            console.log(Date() + "-"+err);
                            res.sendStatus(500);
                          }
                          if (products.deletedCount == 0) {
                              res.sendStatus(404);
                          }
                          else {
                            res.status(200).send('Product deleted succesfully!');
                          }
                      });
                    }else{
                      res.status(403).send("You are trying to delete a product that you do not own");
                    }
          }).catch((error) => {
            res.status(403).send("Token error");
          })
      }else{
        res.status(404).send("There is not any product with the given ID");
      }   
  }) 
};

module.exports.editProduct = function editProduct(req, res, next) {
  var productId = req.id.value;
  var updatedProduct = req.undefined.value;
  console.log(Date() + " - PUT a /products/{id}");     
  //COMPROBACIONES
  if (updatedProduct.id != productId || updatedProduct["id"] == null 
    || updatedProduct["price"] == null || updatedProduct["seller"] == null || updatedProduct["category"] == null 
    || updatedProduct["name"] == null) {
  res.status(409).send("Conflicto al editar el producto. Revisa los parámetros");
  return;
  }    
  var token = res.req.headers.authorization.replace('Bearer ', '');

  AuthResource.auth(token).then( (response)=>{
      var seller = response.userId;
      if(seller != updatedProduct["seller"]){
        res.status(403).send("Token error");
      }else{
          Product.updateOne({id: productId},updatedProduct,(err, products) => {
          if (err) {
            console.log("Error: " + err);
            res.sendStatus(500);
          }else {
            res.status(200).send("Product " + updatedProduct.id + " edited succesfully");
          }
          });
    }
  });
};