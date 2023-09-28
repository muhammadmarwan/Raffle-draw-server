const mongoose = require('mongoose');

const RaffleSchema = new mongoose.Schema({
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Raffle', RaffleSchema);
