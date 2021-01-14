const server = require("../server.js");
const Product = require('../products.js');
const request = require('supertest');
const assert = require('assert');
const axios = require('axios');
const { compare } = require('bcrypt');
const { response } = require('express');

describe('Tests array', function () {
    beforeAll((done) => {
      server.deploy('test').then(() => {
              done();
        })
        .catch((err) => {
          console.log(err.message);
          done(err);
        });
    });
  
    // Delete this when tests are created
    describe('#apiDBControllersTest()', function () {
      apiDBControllersTest();
    });
    
    afterAll((done) => {
      server.undeploy(done);
    });
  });
  
function apiDBControllersTest(){
    describe("Products API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(server).get("/").then((response) => {
                expect(response.status).toBe(200);
                //console.log(response.type);
                expect(response.type).toEqual(expect.stringContaining("html"));
                expect(response.text).toEqual(expect.stringContaining("h1"));
            });
        });
    });
    
    describe("GET /products", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":2})
            ];

            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });
        });

        it("Should return all products", () => {
            return request(server.app).get("/api/v1/products").then((response) => {
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({},expect.any(Function));
            });
        });
    });
    describe("POST /products", () => {
        let dbInsert;
        const product = {"name":"productX","category":"sports","price":1,"seller":1};

        beforeEach(() => {
            dbInsert = jest.spyOn(Product, "create");
        });

        it("Should add a new contact if everything is fine", () => {
            dbInsert.mockImplementation((c, callback) => {
                callback(false); //no hay error
            });

            return request(server.app).post("/api/v1/products").send(product).then((response) => {
                //console.log(response);
                expect(response.statusCode).toBe(201);
                expect(response.text).toEqual(expect.stringContaining("Producto creado con éxito!"));
                expect(dbInsert).toBeCalledWith(product, expect.any(Function));
            });
        });

        it("Should return 500 if there is a problem with de DB", () => {
            const product = {"name":"productX","category":"sports","price":1,"seller":1};
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(server.app).post("/api/v1/products").send(product).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        });
    });
    
    describe("GET /products/client/{id}", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":1,"id":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":2, "id":2})
            ];
    
            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });
        });
    
        it("Should return the products of the client given in the URL", () => {
            return request(server.app).get('/api/v1/products/client/2').then((response) => {
                //console.log(response);
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
            
        });

        it("Should return a 404 Not Found if the ID of the client given in the URL doesn't exist", () => {
            return request(server.app).get('/api/v1/products/client/3').then((response) => {
                //console.log(response);
                expect(response.status).toBe(404);
                //expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
            
        });
    });

    describe("DELETE /products/client/{id}", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":1,"id":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":2, "id":2})
            ];
    
            //dbFind = jest.spyOn(Product, "findproductsbyclient");
            //dbFind.mockImplementation((query, callback) => {
            //    callback(null,products);
            //});
        });
    
        it("Should delete all products of the client given in the URL and return only the remaining products of other clients", () => {
            return request(server.app).delete("/api/v1/products/client/2").then((response) => {
                //console.log(response);
                expect(response.status).toBe(200);
                //expect(response.text).toEqual(expect.stringContaining("Productos del cliente eliminado con éxito!"));
                //expect(response.body).toBeArrayOfSize(1);
                //expect(dbFind).toBeCalledWith({},expect.any(Function));
            });
        });
    });

    describe("GET /products/{id}", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":1,"id":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":2, "id":2})
            ];
    
            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });
        });
    
        it("Should return the products with the id given in the URL", () => {
            return request(server.app).get('/api/v1/products/2').then((response) => {
                //console.log(response);
                expect(response.status).toBe(200);
                expect(response.body).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
            
        });
    });

    describe("DELETE /products/{id}", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":"1","id":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":"2", "id":2})
            ];
    
            /*dbFind = jest.spyOn(Product, "delete");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });*/
        });
    
        it("Should delete the product given in the URL", () => {
            return request(server.app).delete("/api/v1/products/2").then((response) => {
                //console.log(response);
                expect(response.status).toBe(200);
                //expect(response.text).toEqual(expect.stringContaining("Producto eliminado con éxito!"));
                //expect(response.body).toBeArrayOfSize(1);
                //expect(dbFind).toBeCalledWith({},expect.any(Function));
            });
        });
    });

    describe("PUT /products/{id}", () => {
        
        beforeAll(() => {
            const products = [
                new Product({"name":"productX","category":"sports","price":1,"seller":"1","id":1}),
                new Product({"name":"productY","category":"clothes","price":2,"seller":"2", "id":2})
            ];
    
            dbFind = jest.spyOn(Product, "update");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });
        });
    
        it("Should edit the product with the id given in the URL", () => {
            const product = {"name":"productX","category":"games","price":1,"seller":"1","id":1};
            return request(server.app).put('/api/v1/products/1').send(product).then((response) => {
                //console.log(response);
                expect(response.status).toBe(200);
                //expect(dbFind).toBeCalledWith(product, expect.any(Function));
                return request(server.app).get('/api/v1/products/1').then((res) => {
                    expect(res.body).toBeArrayOfSize(1);
                });
            });
            
        });
    });
});
}
