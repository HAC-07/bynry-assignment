// models/Inventory.js
const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, //refers to product model takes objectid from there
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }, //refers to warehouse model stores warehouse details in warehouse id
  quantity: { type: Number, required: true },
});
module.exports = mongoose.model('Inventory', inventorySchema);
