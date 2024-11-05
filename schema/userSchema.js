const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Animals (Cats / Dogs)
// Food (Biriyani / Haleem)
// Color (black / blue)
// Prefer (Ice-cream / Paestry)
// Prefer (Chciken / Mutton)

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
  rollno: {
    type: String,
    required: true
  },
  animals:{
   type : String,
   required : true 
  },
  food: {
    type : String,
    required : true,
  },
  color : {
    type : String,
    required : true,
  },
  prefer1 : {
    type : String ,
    required : true,
  },
  prefer2 : {
    type : String ,
    required : true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);