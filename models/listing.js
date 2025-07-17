const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentShcema = new mongoose.Schema({
  content: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
}, {timestamps: true});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [commentShcema],
}, {timestamps: true});

module.exports = mongoose.model('listing', listingSchema);