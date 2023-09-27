const mongoose = require('mongoose');

const bottleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Bottle', bottleSchema);
