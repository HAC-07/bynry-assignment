const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  quantityChange: Number,
  reason: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryHistory', historySchema);
