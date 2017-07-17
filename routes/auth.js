const express  = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const flash = require('connect-flash');
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
          errorMessage: 'Something went wrong. Try again later.'
        });
        return;
      }
      res.redirect('/');
    });
  });
});


router.get("/login", (req, res, next) => {
  res.render("auth/login");
});
  


// router.post('/login', (req, res, next) => {
//   var email = req.body.email;
//   var password = req.body.password;

//   if (email === "" || password === "") {
//     return res.render("login", {
//       errorMessage: "Indicate an email and a password to login"
//     });
//   }

//   User.findOne({ "email": email }, (err, user) => {
//     if (err || !user) {
//       return res.render("auth/login", {
//         errorMessage: "The email doesn't exist"
//       });
//     }
//     if (bcrypt.compareSync(password, user.password)) {
//       // Save the login in the session!
//       req.session.currentUser = user;
//       res.redirect("/");
//     } else {
//       res.render("auth/login", {
//         errorMessage: "Incorrect password"
//       });
//     }
//   });
// })

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/",
  failureRedirect: "/login"
}));

router.get("/auth/google", passport.authenticate("google", {
  scope: ["https://www.googleapis.com/auth/plus.login",
          "https://www.googleapis.com/auth/plus.profile.emails.read"]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: '/',
  failureRedirect: '/login',
}));


// router.get('/login', ensureLoggedOut(), (req, res) => {
//     res.render('auth/login');
// });

// router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
//   successRedirect : '/',
//   failureRedirect : '/login'
// }));

// router.get('/signup', ensureLoggedOut(), (req, res) => {
//     res.render('auth/signup');
// });

// router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
//   successRedirect : '/',
//   failureRedirect : '/signup'
// }));

// router.post('/logout', ensureLoggedIn('/login'), (req, res) => {
//     req.logout();
//     res.redirect('/');
// });


router.get('/error', ensureAuthenticated, (req, res) => {
  res.render('error', {user: req.user});
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
}



module.exports = router;