const express = require('express');
const debug = require('debug')('server:');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const path = require('path'); 
const User = require('./models/user');
// var rewrite = require('express-urlrewrite');

const app = express();
const port = process.env.PORT || 8080;

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

app.get('/api/allusers', (req,res,next) => {  // only for debugging!
  User.find({}, (err, result) => {
    if (err) debug(err);
    res.send(result);
  });
  // User.remove({},(err)=> console.log(err));
});

app.use(express.static(path.join(__dirname, "public")));

app.post('/api/signup', (req,res,next) => {
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
      res.status(200).send({ login: user.login });
      // res.redirect('/api/login');
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

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return res.status(err.statusCode).send({error: err.message}); };
    if (!user) { return res.status(401).send({error: info.message}); }
    req.logIn(user, function(err) {
      if (err) { return res.status(err.statusCode).send({error: err.message}); }
      // return res.redirect('/userdata/' + user.login);
      return res.status(200).send({ login: user.login });
    });
  })(req, res, next);
});

let isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  // debug(req.user);
  res.status(403).send({error: 'Forbidden'});
}

// TODO: user shouldn't see Login page if Ath-d.

app.get('/api/userdata/:login',  isAuthenticated, (req, res, next) => {
  debug('here');
  if (req.params.login !== req.user.login) {  // can't get other people's page
    debug('forb');
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      debug('success get userdata');
      res.send(result);
    }
  });
});


app.post('/api/userdata/:login', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {  
      let len = result.projects.push(req.body);
      result.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({'_id': result.projects[len-1]._id});
        } else {
          debug(err);
          if(err.name == 'ValidationError') {
            res.statusCode = 400;
            res.send({ error: 'Validation error' });
          } else {
            res.statusCode = 500;
            res.send({error: 'Internal Server Error'});
          }
        }
      });
    }
  })  
});

app.get('/api/userdata/:login/:projectID', isAuthenticated, (req, res, next) => {
  debug('here');
  if (req.params.login !== req.user.login) {  // can't get other people's page
    debug('forb');
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      debug('success get user');
      let project = user.projects.id(req.params.projectID);
      res.send(project); // handle if undefined
    }
  });
});

app.post('/api/userdata/:login/:projectID', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  // can't get other people's page
    debug('forb');
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
      return;
    }
      debug('success get user');
      let project = user.projects.id(req.params.projectID);
      if (!project.tasks) {
        res.status(500).send({error: 'Cannot find such project'});
        return;
      }
      let len = project.tasks.push(req.body);
      user.save((err) => {
      if (!err) {
        debug('updated.');
        res.status(200).send({message: 'OK', task: project.tasks[len-1]});
        return;
      }
        debug(err);
        if(err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({error: 'Internal Server Error'});
          return;
        }        
      });          
  });
});

app.delete('/api/userdata/:login/:projectID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) {
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      user.projects.id(req.params.projectID).remove();
    }
    user.save((err) => {
      if (!err) {
        debug('removed.');
        res.status(200).send({message: 'project removed'});
      } else {
        debug(err);
        res.status(500).send({error: 'Internal Server Error'});
      }
    })
  })
})

app.delete('/api/userdata/:login/:projectID/:taskID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) {
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      let project = user.projects.id(req.params.projectID);
      if (!project.tasks) {
        res.status(500).send({error: 'Internal Server Error'});
        return;
      }
      project.tasks.id(req.params.taskID).remove();
      debug('task removed');
    }
    user.save((err) => {
      if (!err) {
        debug('removed.');
        res.status(200).send({message: 'task removed'});
      } else {
        debug(err);
        res.status(500).send({error: 'Internal Server Error'});
      }
    })
  })
})

app.post('/api/logout', isAuthenticated, (req,res,next) => {
  if (req.body.user == 'secret') {
    debug('logout');
    req.logout();
    res.status(200).send();
  } //....
});

app.get('*', (req, res,next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res, next) => {     // why don't use this via calling next(err)?
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	debug(`${err} _ on req to ${req.url}`);
	res.status(err.status || 500);
	if (err.status) {
		return res.send({error: err.message});
	}	
	res.send({error: 'Internal Server Error'});	
});

app.listen(port, ()=>{
	debug(`Listening on port ${port}`);
});
