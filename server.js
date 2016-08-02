var express = require('express');
var debug = require('debug')('server:');
var bodyParser = require('body-parser');
var path = require('path'); 
var User = require('./models/user');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.engine('ejs', require('ejs-mate'));

app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use((req,res,next) => {
  debug(`req to ${req.url}. AJAX: ${req.xhr}`);
  next();
});

app.get('/allusers', (req,res,next) => {
  User.find({}, (err, result) => {
    debug(err);
    res.send(result);
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.post('/signup',(req,res,next) => {
  let user = new User({
      login: req.body.login,
      password: req.body.password
  });
 
  user.save((err) => {
    debug(err);
    if (err) {
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

   
app.post('/login', (req,res,next) => {
// req.login
// req.password
// if login exist check password
//   if password matches can go to userdata/:login
//   if wrong password response wrong
// if login doesnt exist No such user
User.findOne({login: req.body.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send({error: 'Internal Server Error'});
    }   
    else if (result) { 
      if (result.password === req.body.password) {
        res.status(200).send('Ok, I recognize you.');
      } else {
        res.status(403).send({error: 'Wrong password'});
      }
    } else res.status(404).send({error: "We don't have such user"});
  });
});


app.get('/userdata/:login', (req, res, next) => {
  User.findOne({login: req.params.login}, (err, result) => {
    if (err) { 
      debug(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.send(result.projects);
    }
  });
});
app.post('/userdata/:login',(req,res,next) => {
  // add user projects in DB:
  //find in DB login 
  // add req.body.project in Rumata 
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

app.delete('/userdata/:login/:projectID', (req, res, next) => {
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

// app.get('/userdata/:login',(req,res,next) => {
//   res.end(`You are ${req.params.login}`);
// });

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
