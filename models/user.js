var mongoose = require('../libs/mongoose');
var Schema = mongoose.Schema;

var projectSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

var userSchema = new Schema({
  login: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    unique: true,
    required: true
  },
  projects: [projectSchema]
});

userSchema.methods.validPassword = function(pass){
  return this.password === pass;
}

userSchema.path('login').validate(function (v) {
  return v.length > 2 && v.length < 25;
});

userSchema.path('password').validate(function (v) {
  return v.length > 5 && v.length < 30;
});

module.exports = mongoose.model('User', userSchema);