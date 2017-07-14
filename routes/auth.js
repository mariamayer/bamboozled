const express  = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/user');

const router = express.Router();
const bcryptSalt = 10;

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', {
    errorMessage: ''
  });
});

router.post('/signup', (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    res.render('auth/signup', {
      errorMessage: 'Please provide your email and password to signup'
    });
    return;
  }

  User.findOne({ email: email }, '_id', (err, existingUser) => {
    if (err) {
      next(err);
      return;
    }

    if (existingUser !== null) {
      res.render('auth/signup', {
        errorMessage: `The email ${email} is already in use.`
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashedPass = bcrypt.hashSync(password, salt);

    const userSubmission = {
      name: name,
      email: email,
      password: hashedPass
    };

    const myUser = new User (userSubmission);

    myUser.save((err) => {
      if (err) {
        res.render('auth/signup', {
          errorMessage: 'Something went wrong. Try again later.';
        });
        return;
      }
      res.redirect('/');
    });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', {
    errorMessage: ''
  });
});

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === '' || password === '') {
    res.render('auth/login', {
      errorMessage: 'Please provide your email and password to login'
    });
    return;
  }

  User.findOne({ email: email }, (err, myUser) => {
    if (err || myUser === null) {
      res.render('auth/login', {
        errorMessage: `There isn't any account with email ${email}.`
      });
      return;
    }

    if (!bcrypt.compareSync(password, myUser.password) {
      res.render('auth/login', {
        errorMessage: 'Invalid password.'
      });
      return;
    })

    req.session.currentUser = myUser;
    res.redirect('/');
  });
});

module.exports = router;
