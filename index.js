'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path');

var express = require("express");
var app = express();
var port = (process.env.PORT || 8080);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const dbConnect = require('./db');

var oasTools = require('oas-tools');
var jsyaml = require('js-yaml');
const Product = require('./products');
const { update } = require('./products');

var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
var oasDoc = jsyaml.safeLoad(spec);

var options_object = {
  controllers: path.join(__dirname, './controllers'),
  loglevel: 'info',
  strict: false,
  router: true,
  validator: true
};

oasTools.configure(options_object);

oasTools.initialize(oasDoc, app, function() {
  /*http.createServer(app).listen(port, function() {
    console.log("App running at http://localhost:" + port);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' +port + '/docs');
      console.log("________________________________________________________________");
    }
  });*/
});

dbConnect().then( () => {
      app.listen(port);
      console.log("server ready");
  },
  err => {
      console.log("Connection error: "+err);
});

app.get('/info', (req, res) => {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});
app.get('/', (req, res) => {
  res.send("<html><body><h1>API del microservicio de productos</h1></body></html>");
});
/*
app.get('/products', (req, res) => {
  console.log(Date() + " - GET a /products");
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
});

app.post("/products", (req,res)=>{
  console.log(Date() + " - POST a /products");
  var product = req.body;
  //comprobacion de errores
  Product.create(product,(err)=>{
      if (err){
          console.log(Date() + "-"+err);
          res.sendStatus(500);
      }else{
          res.sendStatus(201);
      }
  });
})*/

/*
app.get('/products/:productId', (req, res) => {
  var productId = req.params.productId;
  console.log(Date() + " - GET a /products/productId");
  Product.find({"id":productId},(err,products)=>{
    if (err){
        console.log(Date() + "-"+err);
        res.sendStatus(500);
    }else{
        res.send(products.map((product)=>{
            return product.cleanup();
        }));
    }
});
});

app.get('/products/client/:clientId', (req, res) => {
  var clientId = req.params.clientId;
  console.log(Date() + " - GET a /products/client/clientId");
  Product.find({"seller":clientId},(err,products)=>{
    if (err){
        console.log(Date() + "-"+err);
        res.sendStatus(500);
    }else{
        res.send(products.map((product)=>{
            return product.cleanup();
        }));
    }
});
});

app.delete("/products/:productId", (req, res) => {        
  var productId = req.params.productId;
  console.log(Date() + " - DELETE a /products/{id}");
  Product.remove({ "id": productId },(err, products) => {
      if (err) {
        console.log(Date() + "-"+err);
      }
      if (products.length == 0) {
          res.sendStatus(404);
      }
      else {
          res.sendStatus(200);
      }
  });

});
*/
app.delete("/products", (req, res) => {   
  console.log(Date() + " - DELETE a /products");     
  Product.remove({},(err, products) => {
      if (err) {
        console.log(Date() + "-"+err);
      }
      if (products.length == 0) {
          res.sendStatus(404);
      }
      else {
          res.sendStatus(200);
      }
  });

});
/*
app.put("/products/:productId", (req, res) => {
            var productId = req.params.productId;
            var updatedProduct = req.body;
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
                }
                else {
                    console.log("editado con exito")
                    res.sendStatus(200);
                }
            });
        
        });
*/

module.exports = app;
module.exports = port;