const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    },
  bottleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bottle',
    required: true,
  },
  raffle: {
    type: Number,
    default: 0, 
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
