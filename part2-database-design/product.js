const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  sku: { type: String, required: true, unique: true },
  price: mongoose.Types.Decimal128,
  type: { type: String, enum: ['single', 'bundle'], default: 'single' },
  bundleItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  threshold: { type: Number, default: 20 } //can be changed according to requirements
});

module.exports = mongoose.model('Product', productSchema);
