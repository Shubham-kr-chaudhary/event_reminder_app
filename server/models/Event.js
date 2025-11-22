const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  image: { type: String }, // URL to image
  status: { type: String, enum: ['Upcoming', 'Completed'], default: 'Upcoming' },
  notified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Event', EventSchema);