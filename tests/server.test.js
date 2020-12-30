const app = require("../index.js");
const Product = require('../products.js');
const request = require('supertest');

describe("Hello World tests", () => {
    it("Should do an stupid test", () => {
        const a = 5;
        const b = 3;
        const sum = a + b;

        expect(sum).toBe(8);
    });
});

describe("Products API", () => {
    describe("GET /", () => {
        it("Should return an HTML document", () => {
            return request(app).get("/").then((response) => {
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
            return request(app).get("/api/products").then((response) => {
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

            return request(app).post("/api/products").send(product).then((response) => {
                //console.log(response);
                expect(response.statusCode).toBe(200);
                expect(response.text).toEqual(expect.stringContaining("Producto creado con éxito!"));
                expect(dbInsert).toBeCalledWith(product, expect.any(Function));
            });
        });

        it("Should return 500 if there is a problem with de DB", () => {
            const product = {"name":"productX","category":"sports","price":1,"seller":1};
            dbInsert.mockImplementation((c, callback) => {
                callback(true);
            });

            return request(app).post("/api/products").send(product).then((response) => {
                expect(response.statusCode).toBe(500);
            });
        })
    })
});
