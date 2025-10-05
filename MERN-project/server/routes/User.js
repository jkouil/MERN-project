// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    trim: true
  },
  courriel: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('User', UserSchema);
