const mongoose = require('mongoose');

const RaffleSchema = new mongoose.Schema({
  bottleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
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
  }
});

module.exports = mongoose.model('Raffle', RaffleSchema);
