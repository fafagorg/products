const Product = require('../products');
const mongoose = require('mongoose');
const dbConnect = require('../db');

describe('Products DB connection', () => {
    beforeAll(() => {
        return dbConnect();
    })

    beforeEach((done) => {
        Product.deleteMany({}, (err) => {
            done();
        });
    });

    it('insert a product in the DB', (done) => {
        const product = new Product({name: 'productX', category: 'sports', price: 8, seller: 1, id: 1});
        product.save((err, product) => {
            expect(err).toBeNull();
            Product.find({}, (err, products) => {
                expect(products).toBeArrayOfSize(1);
                done();
            });
        });
    });

    afterAll((done) => {
        mongoose.connection.db.dropDatabase(() => {
            mongoose.connection.close(done);
        });
    });
});