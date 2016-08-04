let express = require('express');
let debug = require('debug')('server:');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let flash = require('express-flash');
let path = require('path'); 
let User = require('./models/user');

let app = express();
let port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password'
  },
  function(login, password, done) {
    User.findOne({ login: login }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        debug('Incorrect username');
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        debug('invalid password');
        return done(null, false, { message: 'Incorrect password.' });
      }
      debug('valid');
      return done(null, user);
    });
  }
));

passport.serializeUser(function(user, done) {
  debug('ser');
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  debug('deser');
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use((req,res,next) => {
  debug(`req to ${req.url}. AJAX: ${req.xhr}`);
  next();
});

app.get('/allusers', (req,res,next) => {  // only for debugging!
  // but if DB doesn't work?
  User.find({}, (err, result) => {
    debug(err);
    res.send(result);
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.post('/signup', (req,res,next) => {
  let user = new User({
    login: req.body.login,
    password: req.body.password
  });
 
  user.save((err) => {
    if (err) {
    debug(err);
      if (err.code && err.code == 11000) { // MongoDB:if login is not unique
        res.statusCode = 403;
        res.send({ error: 'duplicate' });        
      } else if (err.name == 'ValidationError') {
        res.statusCode = 400;
        res.send({ error: 'Validation error' });
      } else {
        res.statusCode = 500;
        res.send({ error: 'Server error' });
      }
    } else {
      res.status(200).send(`Welcome aboard, ${user.login}!`);
    }
  });
});
   
// app.post('/login', (req,res,next) => {
// User.findOne({login: req.body.login}, (err, result) => {
//     if (err) { 
//       debug(err);
//       res.status(500).send({error: 'Internal Server Error'});
//     }   
//     else if (result) { 
//       if (result.password === req.body.password) {
//         res.status(200).send('Ok, I recognize you.');
//       } else {
//         res.status(403).send({error: 'Wrong password'});
//       }
//     } else res.status(404).send({error: "We don't have such user"});
//   });
// });

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(err.statusCode).send({error: err.message}); };
    if (!user) { return res.status(401).send({error: info.message}); }
    req.logIn(user, function(err) {
      if (err) { return res.status(err.statusCode).send({error: err.message}); }
      return res.redirect('/userdata/' + user.login);
    });
  })(req, res, next);
});

let isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

app.get('/userdata/:login',  isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  // can't get other people's page
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send('Internal Server Error');
    } else {
      debug('success get proj');
      res.send(result.projects);
    }
  });
});

app.post('/userdata/:login', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else { // why should search user again?
      let len = result.projects.push({name: req.body.project});
      result.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send(result.projects[len-1]._id);
        } else {
          debug(err);
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({ error: 'Server error' });
          }
        }
      });
    }
  })  
});

app.delete('/userdata/:login/:projectID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) {
      debug(err);
      res.status(500).send('Internal Server Error');
    } else {
      result.projects.id(req.params.projectID).remove();
    }
    result.save((err) => {
      if (!err) {
        debug('removed.');
        res.status(200).send('OK');
      } else {
        debug(err);
        res.status(500).send({error: 'Internal Server Error'});
      }
    })
  })
})

app.use((req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	debug(`${err} _ on req to ${req.url}`);
	res.status(err.status || 500);
	if (err.status) {
		res.end(err.message);
	}	
	res.end('Internal Server Error');	
});

app.listen(port, ()=>{
	debug(`Listening on port ${port}`);
});
