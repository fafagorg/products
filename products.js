const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:String,
    price: Number,
    seller: Number, //id del vendedor
    category: String,
    id: Number
});

productSchema.methods.cleanup = function(){
    return {name: this.name, price: this.price, seller: this.seller, category: this.category};
}

const Product = mongoose.model('Product',productSchema);

module.exports = Product;