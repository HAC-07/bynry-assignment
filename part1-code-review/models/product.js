// models/Product.js
const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, unique: true, required: true }, //sku needs to be present and unique
  price: { type: mongoose.Types.Decimal128, required: true }, //price needs to be present and decimal128 stores prices upto 35 digits making it useful for currency logic
});
module.exports = mongoose.model('Product', productSchema);
