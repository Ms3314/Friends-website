const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  choice : {
      type: [],
      required: true
    }
});

module.exports = mongoose.model('User', userSchema);