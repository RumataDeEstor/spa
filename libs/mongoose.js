const mongoose = require('mongoose');
const debug = require('debug')('server:mongoose')
// mongoose.connect('mongodb://localhost/app');
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;

mongoose.connection.db.dropDatabase();

db.on('error', (err) => { 
  debug('connection error:', err.message);
});

db.once('open', () => {
  debug("Connected to DB!");
});

module.exports = mongoose;