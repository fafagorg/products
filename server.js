'use strict';
const port = (process.env.PORT || 8080);

const deploy = (env) => {
    return new Promise((resolve, reject) => {
        const dbConnect = require('./db');
        const fs = require('fs');
        const http = require('http');
        const path = require('path');
        const express = require("express");
        const cors = require("cors");
        const app = express();
        app.use(cors());
        const bodyParser = require('body-parser');
        app.use(bodyParser.json({
            strict: false
        }));
        const oasTools = require('oas-tools');
        const jsyaml = require('js-yaml');
        const spec = fs.readFileSync(path.join(__dirname, '/api/oas-doc.yaml'), 'utf8');
        const oasDoc = jsyaml.safeLoad(spec);
        var options_object = {
            controllers: path.join(__dirname, './controllers'),
            loglevel: env === 'test' ? 'error' : 'info',
            strict: false,
            router: true,
            validator: true
        };
        app.use((req, res, next) => {
            req.connection = dbConnect;
            next();
        });
        oasTools.configure(options_object);
        oasTools.initialize(oasDoc, app, function () {
            http.createServer(app).listen(port, function () {
                dbConnect().then(() => {
                    if (env !== 'test') {
                        console.log("App running at http://localhost:" + port);
                        console.log("________________________________________________________________");
                        if (options_object.docs !== false) {
                            console.log('API docs (Swagger UI) available on http://localhost:' + port + '/docs');
                            console.log("________________________________________________________________");
                        }
                    }
                    resolve();
                }, err => {
                    console.log("SERVER PORT: " + port);
                    //console.log("DB URL");
                    console.log("Connection error: " + err);
                    reject(err);
                });
            });
            resolve();
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
        app.delete("/products", (req, res) => {
            console.log(Date() + " - DELETE a /products");
            Product.remove({}, (err, products) => {
                if (err) {
                    console.log(Date() + "-" + err);
                }
                if (products.length == 0) {
                    res.sendStatus(404);
                }
                else {
                    res.sendStatus(200);
                }
            });

        });

    });
};

const undeploy = () => {
    process.exit();
};

module.exports = {
    deploy: deploy,
    undeploy: undeploy,
    port: port
};