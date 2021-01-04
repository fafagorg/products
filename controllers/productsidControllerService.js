'use strict'
const Product = require('../products');

module.exports.findproductbyid = function findproductbyid(req, res, next) {
  var productId = req.id.value;
  console.log(Date() + " - GET a /products/productId");
  Product.find({},(err,products)=>{
    if (err){
        console.log(Date() + "-"+err);
        res.sendStatus(500);
    }else{
      res.send(products.filter(p => p.id == productId).map((product)=>{
            return product.cleanup();
        }));
    }
});
};
//
//OJO, SI HAY VARIOS PRODUCTOS CON EL MISMO ID, SÓLO BORRA UNO. NO DEBERÍA PASAR, PQ SOLO DEBERIA HABER UN PRODUCTO POR ID
module.exports.deleteProduct = function deleteProduct(req, res, next) {
  var productId = req.id.value;
  console.log(Date() + " - DELETE a /products/{id}");
  Product.deleteOne({ "id": productId },(err, products) => {
      if (err) {
        console.log(Date() + "-"+err);
      }
      if (products.length == 0) {
          res.sendStatus(404);
      }
      else {
        res.send("Producto eliminado con éxito!")
        //res.sendStatus(200);
      }
  });
};

module.exports.editProduct = function editProduct(req, res, next) {
  var productId = req.id.value;
  var updatedProduct = req.undefined.value;
  console.log(Date() + " - PUT a /products/{id}");     

  //COMPROBACIONES
  if (updatedProduct.length > 5 || updatedProduct.id != productId || updatedProduct["id"] == null 
    || updatedProduct["price"] == null || updatedProduct["seller"] == null || updatedProduct["category"] == null 
    || updatedProduct["name"] == null) {
  res.sendStatus(400);
  return;
  }    
            
  Product.updateOne({ "id": productId},updatedProduct,(err, products) => {
  if (err) {
    console.log("Error: " + err);
    res.sendStatus(500);
    return;
  }else {
    console.log("editado con exito")
    res.sendStatus(200);
  }
  });
};