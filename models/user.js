const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const ruleSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  label: {
    type: String,
    default: 'transparent',
  },
  fine: { 
    type: Number,
    default: 0,
    required: true
  }
});

const promotionSchema = new Schema({
  name: {
    type: String,
    default: 'Unnamed',
    required: true
  },
  price: {
    type: Number,
    default: 10,
    required: true
  },
  repeated: {
    type: Boolean,
    default: false
  }
});

const taskSchema = new Schema({
  name: {
    type: String,
    default: 'Unnamed',
    required: true
  },
  points: {
    type: Number,
    default: 5,
    required: true
  },
  repeated: {
    type: Boolean,
    default: false
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
    default: 'transparent'
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
    required: true
  },
  projects: [projectSchema],
  rules: [ruleSchema],
  promotions: [promotionSchema],
  points: {
    type: Number,
    default: 0
  }
});

userSchema.methods.validPassword = function(pass){
  return this.password === pass;
}

userSchema.path('login').validate(function (v) {
  return ( (v.length > 3 && v.length < 21) 
          && (/^[a-zA-Z]\w+$/.test(v)) );
});

userSchema.path('password').validate(function (v) {
  return ( (v.length > 5 && v.length < 21)
          && (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/.test(v)) );
});

module.exports = mongoose.model('User', userSchema);