// models/Warehouse.js
const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
