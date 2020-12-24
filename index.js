'use strict';

var fs = require('fs'),
    http = require('http'),
    path = require('path');

var express = require("express");
var app = express();
var port = 8080;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const dbConnect = require('./db');

dbConnect().then(
  () => {
      app.listen(port);
      console.log("server ready");
  },
  err => {
      console.log("Connection error: "+err);
  }
);

//var oasTools = require('oas-tools');
//var jsyaml = require('js-yaml');
const Product = require('./products');

//var spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
//var oasDoc = jsyaml.safeLoad(spec);

//var options_object = {
//  controllers: path.join(__dirname, './controllers'),
//  loglevel: 'info',
//  strict: false,
//  router: true,
//  validator: true
//};

//oasTools.configure(options_object);

/*oasTools.initialize(oasDoc, app, function() {
  http.createServer(app).listen(serverPort, function() {
    console.log("App running at http://localhost:" + serverPort);
    console.log("________________________________________________________________");
    if (options_object.docs !== false) {
      console.log('API docs (Swagger UI) available on http://localhost:' + serverPort + '/docs');
      console.log("________________________________________________________________");
    }
  });
});*/

app.get('/info', function(req, res) {
  res.send({
    info: "This API was generated using oas-generator!",
    name: oasDoc.info.title
  });
});
app.get('/', function(req, res) {
  res.send("<html><body><h1>API del microservicio de productos</h1></body></html>");
});

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
})