var passport = require('passport');
var Account = require('./user');
var router = require('express').Router();

router.get('/', function(req, res) {
  res.render('index', { user: req.user });
});

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res, next) {
  console.log('registering user');
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    if (err) { console.log('error while user register!', err); return next(err); }

    console.log('user registered!');

    res.redirect('/');
  });
});

router.get('/login', function(req, res) {
  res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.redirect('/public');
});

router.post('/jsonlogin',  function(req, res, next){
  var message = {};
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      message.code = 500;
      message.msg = error;
      return res.json(message);
    }

    if(!user){
      message.code = 401;
      message.msg = "auth fails";
      return res.json(message);
    }

    req.logIn(user, function (err){
      if (err) {
        message.code = 400;
        message.msg = err;
        return res.json(message);
      }
      req.user.loginCnt++;
      req.user.save();
      message.username = req.user.username;
      message.code = 200;
      message.msg = "Login ok";
      message.loginCnt = req.user.loginCnt;
      message.level = req.user.level;
      res.json(message);
    });
  })(req, res, next);
});

router.get('/jsonlogout', function (req, res) {
  req.logout();
  var message = {};
  message.code = 200;
  message.msg = "logout ok";
  res.json(message);
});

router.post('/jsonregister', function(req, res) {
  Account.register(new Account({ username: req.body.username }), req.body.password, function(err) {
    var message = {};
    if (err) {
      message.code = 500;
      message.msg = err;
    }else{
      message.code = 200;
      message.msg = "register ok";
      message.username = req.body.username;
    }
    res.json(message);
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
