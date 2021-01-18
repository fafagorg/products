const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
      },
    category: {
        type: String,
        required: true
      },
    price: {
        type: String,
        required: true
      },
    seller: {
        type: String,
        required: true
      },
    id: {
        type: Number,
        required: true,
        unique: true
      }
});

productSchema.methods.cleanup = function(){
    return {name: this.name, category: this.category, price: this.price, seller: this.seller, id: this.id};
}

const Product = mongoose.model('Product',productSchema);

module.exports = Product;