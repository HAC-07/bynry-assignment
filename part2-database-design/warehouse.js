const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: String,
  location: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' }
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
