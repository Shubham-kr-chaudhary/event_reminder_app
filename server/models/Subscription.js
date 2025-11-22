const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  endpoint: String,
  keys: {
    p256dh: String,
    auth: String
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);