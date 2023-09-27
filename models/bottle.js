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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  raffle: {
    type: Number,
    default: 0, // Default value for the raffle field
},
});

module.exports = mongoose.model('Bottle', bottleSchema);
