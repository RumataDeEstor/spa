var mongoose = require('mongoose');
var debug = require('debug')('server:mongoose')
// mongoose.connect('mongodb://localhost/app');
mongoose.connect(process.env.MONGO_URI);
var db = mongoose.connection;

db.on('error', (err) => { 
  debug('connection error:', err.message);
});

db.once('open', () => {
  debug("Connected to DB!");
});

module.exports = mongoose;