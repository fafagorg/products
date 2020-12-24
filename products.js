const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:String,
    category:String,
    price: Number,
    seller: Number, //id del vendedor
    id: Number
});

productSchema.methods.cleanup = function(){
    return {name: this.name, price: this.price, seller: this.seller};
}

const Product = mongoose.model('Product',productSchema);

module.exports = Product;