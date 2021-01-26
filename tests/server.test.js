const server = require("../server.js");
const Product = require('../products.js');
const assert = require('assert');
const axios = require('axios');
const nock = require('nock');
const Auth = require('../resources/authResource');

const baseURL = 'http://localhost:' + server.port;

nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
    .post('/api/v1/auth/login')
    .reply(200, {
        "ok": true,
        "user": "test",
        "token": "test"
});

nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
    .post('/api/v1/auth/validate')
    .reply(200, {
        "userId": "test"
});

console.log(process.env.HOST_AUTH);

// Testing Workflow
describe('Tests array', function () {
    beforeAll((done) => {
        console.log("Starting server");
    
        server.deploy('test').then(() => {
            done();
        }).catch((err) => {
            console.log(err.message);
            done(err);
        });
    });


    // Delete this when tests are created
    describe('#apiDBControllersTest() - Products API', function () {
        apiDBControllersTest();
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 1000)); // avoid jest open handle error
      });
});

// Tests
function apiDBControllersTest() {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return axios.get(baseURL + "/").then((response) => {
                expect(response.status).toBe(200);
                expect(response.headers['content-type']).toEqual(expect.stringContaining("text/html; charset=utf-8"));
                expect(response.data).toEqual(expect.stringContaining("<html><body><h1>API del microservicio de productos</h1></body></html>"));
            });
        });
    });

    describe("GET /products", () => {

        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "pepe", "id":1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "test", "id":2 })
            ];

            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, products);
            });
        });

        it("Should return all products", () => {
            return axios.get(baseURL + "/api/v1/products").then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBeArrayOfSize(2);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });
        });
    });

    describe("POST /products", () => {
        let dbInsert;
        var product;
        
        beforeEach(() => {
            dbInsert = jest.spyOn(Product, "create");
            
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
        })

        it("Should add a new contact if everything is fine", () => {
            product = { "name": "productX", "category": "sports", "price": 1, "seller": "test","id": 3 }
            dbInsert.mockImplementation((c, callback) => {
                callback(false); //no hay error
            });
            
            return axios.post(baseURL + "/api/v1/products", product, {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(response.status).toBe(201);
                expect(dbInsert).toBeCalledWith(product, expect.any(Function));
            });
        });

        it("Should not add a new contact if token is not valid", () => {
            product = { "name": "productX", "category": "sports", "price": 1, "seller": "invalid","id": 50 };
            dbInsert.mockImplementation((c, callback) => {
                callback(false); //no hay error
            });

            return axios.post(baseURL + "/api/v1/products", product, {
                headers:{
                    'Authorization': `test`
                }
            }).then((respuesta) => {
                expect(dbInsert).toBeCalledWith(product, expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(409);            
            });;
        });

        it("Should return 500 if there is a problem with de DB", () => {
            product = { "name": "productX", "category": "sports", "price": 1, "seller": "1" };
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return axios.post(baseURL + "/api/v1/products", product, {
                headers:{

                }}).then((response) => {
                    expect(dbInsert).toBeCalledWith(product, expect.any(Function));
                }).catch((err) => {
                    expect(err.response.status).toBe(500);            
                });
        });
    });

    describe("GET /products/client/{id}", () => {

        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "a", "id": 1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "b", "id": 2 })
            ];

            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, products);
            });
        });

        it("Should return the products of the client given in the URL", () => {
            return axios.get(baseURL + '/api/v1/products/client/b').then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });

        });

        it("Should return a 404 Not Found if the ID of the client given in the URL doesn't exist", () => {
            return axios.get(baseURL + '/api/v1/products/client/c').then((response) => {
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(404);
            });           

        });
    });

    describe("DELETE /products/client/{id}", () => {

        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "pepe", "id": 1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "test", "id": 2 })
            ];

            dbDeleteMany = jest.spyOn(Product, "deleteMany");
            dbDeleteMany.mockImplementation((query, callback) => {
                callback(null, products);
            });
        });
        
        it("Should delete all products of the client given in the URL", () => {
            return axios.delete(baseURL + "/api/v1/products/client/test", {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toEqual(expect.stringContaining("Products of client: test deleted succesfully!"));
                expect(dbDeleteMany).toBeCalledWith({"seller":"test"}, expect.any(Function));
            });
        });

        it("Should not delete the products of a client different than the given in the URL", () => {
            return axios.delete(baseURL + "/api/v1/products/client/pepe", {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(dbDeleteMany).toBeCalledWith({"seller":"pepe"}, expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(409);
            });
        });
    });

    describe("GET /products/{id}", () => {

        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "pepe", "id": 1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "test", "id": 2 })
            ];

            dbFind = jest.spyOn(Product, "find");
            dbFind.mockImplementation((query, callback) => {
                callback(null, products);
            });
        });

        it("Should return the products with the id given in the URL", () => {
            return axios.get(baseURL + '/api/v1/products/2').then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toBeArrayOfSize(1);
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            });

        });

        it("Should return 404 if it does not exist any product with the ID given in in the URL", () => {
            return axios.get(baseURL + '/api/v1/products/999').then((response) => {
                expect(dbFind).toBeCalledWith({}, expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(404);
            });;
        });
    });

    describe("DELETE /products/{id}", () => {
        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "prueba", "id": 1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "test", "id": 2 })
            ];

            dbFind = jest.spyOn(Product, "deleteOne");
            dbFind.mockImplementation((query, callback) => {
                callback(null,products);
            });
        });

        beforeEach(() => {
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
        })

        it("Should delete the product given in the URL", () => {
            
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
            
            return axios.delete(baseURL + "/api/v1/products/2", {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toEqual(expect.stringContaining("Product deleted succesfully!"));
                expect(dbFind).toBeCalledWith({id:2},expect.any(Function));
            }).catch((err) => {
                console.log(err.response)
            });
        });

        it("Should not delete the product if the seller is not the authenticated one (token)", () => {
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
            
            var product = { "name": "productY", "category": "clothes", "price": 2, "seller": "test", "id": 2 }

            return axios.delete(baseURL + "/api/v1/products/1", {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(dbFind).toBeCalledWith({id:1},expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(403);
            });
        });
    });

    describe("PUT /products/{id}", () => {

        beforeAll(() => {
            const products = [
                new Product({ "name": "productX", "category": "sports", "price": 1, "seller": "test", "id": 1 }),
                new Product({ "name": "productY", "category": "clothes", "price": 2, "seller": "pepe", "id": 2 })
            ];

            dbPut = jest.spyOn(Product, "updateOne");
            dbPut.mockImplementation((c, prod, callback) => {
                callback(null, products);
            });
        });

        it("Should edit the product with the id given in the URL", () => {
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
            var updatedProduct = { "name": "productX", "category": "games", "price": 1, "seller": "test", "id": 1 };
            return axios.put(baseURL + '/api/v1/products/1', updatedProduct, {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(response.status).toBe(200);
                expect(response.data).toEqual(expect.stringContaining("Product 1 edited succesfully"));
                expect(dbPut).toBeCalledWith({id:1}, updatedProduct , expect.any(Function));
            });

        });

        it("Should not edit the product if the user authenticated do not own it", () => {
            nock((process.env.HOST_AUTH || 'http://51.103.75.211'), { allowUnmocked: true})
                .post('/api/v1/auth/validate')
                .reply(200, {
                    "userId": "test"
            });
            var updatedProduct = { "name": "productX", "category": "games", "price": 1, "seller": "test", "id": 1 };
            return axios.put(baseURL + '/api/v1/products/2', updatedProduct, {
                headers:{
                    'Authorization': `test`
                }
            }).then((response) => {
                expect(dbPut).toBeCalledWith({id:1}, updatedProduct , expect.any(Function));
            }).catch((err) => {
                expect(err.response.status).toBe(409);
            });

        });
    });
}
