const express = require('express');
const debug = require('debug')('server:');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash');
const path = require('path'); 
const favicon = require('serve-favicon');
const User = require('./models/user');

const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + '/public/favicon/favicon.ico'));
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
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

let isAuthenticated = function (req, res, next) {
  const loginsMatch = () => {
    if (req.params.login) {
      return req.params.login === req.user.login;
    }
    return true;
  }

  if (req.isAuthenticated() && loginsMatch()) 
    return next(); 
  res.status(403).send({error: 'Forbidden'});
}

app.get('/api/checkAccess/:login', isAuthenticated, (req, res, next) => {
  res.status(200).redirect(`/api/userdata/${req.params.login}`);
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
    }
  });
});
   
app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
      console.log('auth error');
      return res.status(err.statusCode).send({error: err.message}); 
    };
    if (!user) { return res.status(401).send({error: info.message}); }
    req.logIn(user, function(err) {
      if (err) { return res.status(err.statusCode).send({error: err.message}); }
      return res.status(200).send({ login: user.login });
    });
  })(req, res, next);
});

// TODO: user shouldn't see Login page if Ath-d.

app.get('/api/userdata/:login',  isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) { 
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      let {login, points, projects, rewards, rules, _id} = user;
      let userdata = {login, points, projects, rewards, rules, _id};
      res.status(200).send({user: userdata});
    }
  });
});

// add new project
app.post('/api/userdata/:login/projects', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {  
      let newProject = req.body;
      newProject.name = newProject.name || "Unnamed";
      let len = user.projects.push(newProject);
      user.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'OK', project: user.projects[len-1]});
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

// add new rule
app.post('/api/userdata/:login/rules', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {  
      let newRule = req.body;
      newRule.name = newRule.name || "Unnamed";
      let len = user.rules.push(newRule);
      user.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'OK', rule: user.rules[len-1]});
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

app.post('/api/userdata/:login/points', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {  
      newPoints = user.points+req.body.points;
      user.points = newPoints;
      user.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'points updated'});
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

//add new Reward
// TODO: additional validation on server side 
app.post('/api/userdata/:login/rewards', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else { 
      let newReward = req.body;
      newReward.name = newReward.name || "Unnamed";
      let len = user.rewards.push(newReward);
      user.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'OK', reward: user.rewards[len-1]});
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

app.put('/api/userdata/:login/rewards/:rewardID', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {  
      let updatedReward = null;
      user.rewards.map(reward => {
        if (reward._id == req.params.rewardID) {
          reward.name = req.body.name || reward.name;
          reward.price = req.body.price || reward.price;
          reward.repeated = (req.body.repeated !== undefined) ?
            req.body.repeated : reward.repeated;
          updatedReward = reward;
        } 
      }); 

      user.save((err) =>{
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'updated', reward: updatedReward});
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

app.delete('/api/userdata/:login/rewards/:rewardID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) {
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      user.rewards.id(req.params.rewardID).remove();
    }
    user.save((err) => {
      if (!err) {
        debug('removed.');
        res.status(200).send({message: 'reward removed'});
      } else {
        debug(err);
        res.status(500).send({error: 'Internal Server Error'});
      }
    })
  })
})

// update single project
app.put('/api/userdata/:login/projects/:projectID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      user.projects.map(project => {
        if (project._id == req.params.projectID) {
          project.name = req.body.name;
          project.label = req.body.label;
        }
      });     

      user.save((err) => {
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'updated'});
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
    }
  });
});

// update single rule
app.put('/api/userdata/:login/rules/:ruleID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) { 
    debug('forb');
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      user.rules.map(rule => {
        if (rule._id == req.params.ruleID) {
          rule.name = req.body.name;
          rule.label = req.body.label;
          rule.fine = req.body.fine;
        }
      });     

      user.save((err) => {
        if (!err) {
          debug('updated.');
          res.status(200).send({message: 'updated'});
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
    }
  });
});

// delete single project
app.delete('/api/userdata/:login/projects/:projectID', isAuthenticated, (req, res, next) => {
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

// delete single rule
app.delete('/api/userdata/:login/rules/:ruleID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) {
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    } else {
      user.rules.id(req.params.ruleID).remove();
    }
    user.save((err) => {
      if (!err) {
        debug('removed.');
        res.status(200).send({message: 'rule removed'});
      } else {
        debug(err);
        res.status(500).send({error: 'Internal Server Error'});
      }
    })
  })
})

// add new task
app.post('/api/userdata/:login/projects/:projectID', isAuthenticated, (req,res,next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
      return;
    }
      let project = user.projects.id(req.params.projectID);
      if (!project.tasks) {
        res.status(500).send({error: 'Cannot find such project'});
        return;
      }
      
      let newTask = req.body;
      newTask.name = newTask.name || "Unnamed";
      let len = project.tasks.push(newTask);
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

// delete single task
app.delete('/api/userdata/:login/projects/:projectID/:taskID', isAuthenticated, (req, res, next) => {
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
      debug('removed');
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

// update single task
app.put('/api/userdata/:login/projects/:projectID/:taskID', isAuthenticated, (req, res, next) => {
  if (req.params.login !== req.user.login) {  
    return res.status(403).send({error: 'Forbidden'});
  }
  User.findOne({login: req.params.login}, (err, user) => {
    if (err) {
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
      return;
    } 
    let project = user.projects.id(req.params.projectID);
    if (!project.tasks) {
      res.status(500).send({error: 'Internal Server Error'});
      return;
    }
    project.tasks.map(task => {
      if (task._id == req.params.taskID) {
        task.name = req.body.name;
        task.points = req.body.points;
        task.repeated = req.body.repeated;
      }
    });  

    user.save((err) => {
      if (!err) {
        debug('updated.');
        res.status(200).send({message: 'updated'});
        return;
      }
        debug(err);
        if (err.name == 'ValidationError') {
          res.statusCode = 400;
          res.send({ error: 'Validation error' });
        } else {
          res.statusCode = 500;
          res.send({error: 'Internal Server Error'});
          return;
        }        
    });    
  })
})

app.post('/api/logout', isAuthenticated, (req,res,next) => {
  if (req.body.user == 'secret') {
    req.logout();
    res.status(200).send();
  } 
});

app.get('*', (req, res,next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res, next) => {     
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


