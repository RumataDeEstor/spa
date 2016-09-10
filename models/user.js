const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'white',
  },
  price: {
    type: Number,
    default: 0,
    required: true
  }
});

const taskSchema = new Schema({
  name: {
    type: String,
    default: 'Unnamed',
    required: true
  },
  label: {
    type: String,
    default: 'white',
  },
  points: {
    type: Number,
    default: 0
  }
});

const projectSchema = new Schema({
  name: {
    type: String,
    default: 'Unnamed',
    required: true
  },
  label: {
    type: String,
    default: 'white',
  },
  points: {
    type: Number,
    default: 0
  },
  tasks: [taskSchema]
});

const userSchema = new Schema({
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
  projects: [projectSchema],
  rules: [ruleSchema],
  points: {
    type: Number,
    default: 0
  }
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