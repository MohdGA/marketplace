const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String
}, {timestamps: true});

module.exports = mongoose.model('listing', listingSchema);