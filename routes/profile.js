const express = require('express');
const User = require('../models/user');
const Avatar = require('../models/avatar');
const multer = require('multer');
const upload = multer({ dest: './public/uploads' });

const router = express.Router();

router.get('/profile/:id', (req, res, next) => {
      var userLogged = false;
      var isOwner = false;
      var userLoggedId = "";

      if(req.user){
        userLogged = true;
        userLoggedId = req.user.id;
      }

      const userId = req.params.id;

      if(userId == userLoggedId){
        isOwner = true;
      }

    User.find({_id: userId}, (err, users) => {
        if (err) { return next(err) }

        if (users.length === 0) {
            res.render('auth/index', { errorMessage: 'Id not found. Try logging in.'});
        }

        res.render('profile/index', {
          user: users[0],
          userLogged,
          isOwner,
        });
    });
  });


router.get('/profile/:id/edit', (req, res, next) => {
    let userLogged = false;
    req.user ? userLogged = true : "";
    const userId = req.params.id;

        User.find({_id: userId}, (err, users) => {
            if (err) { return next(err) }

            if (users.length === 0) {
                res.render('auth/index', { errorMessage: 'Id not found. Try logging in.'});
            }

            res.render('profile/edit', { user: users[0], userLogged });
        });
});
router.post('/profile/:id', (req, res) => {
    const userId = req.params.id;

    const updates = {
     email: req.body.email,
     name: req.body.name,
     age: req.body.age,
     gender: req.body.gender,
     bio: req.body.bio
    };

  User.findByIdAndUpdate(userId, updates, (err, users) => {
    if (err) { return next(err) }
    res.redirect(`/profile/${userId}`);
  });
});


router.post('/upload', upload.single('avatar'), (req, res) => {
    const userId = req.body.id;
    avatar = new Avatar({
        avatarPath: `/uploads/${req.file.filename}`,
        avatarName: req.file.originalname
  });

    const updates = {
        avatar:  `../uploads/${req.file.filename}`,
    };


    avatar.save((err) => {
        User.findByIdAndUpdate(userId, updates, (err, user) => {
            if (err) { return next(err) }
            res.redirect(`/profile/${userId}/edit`);
        });

    });
  });

router.get('/profile/:id/edit', (req, res, next) => {
    var userLogged = false;
    req.user ? userLogged = true : "";
    if (userLogged) {
        res.render('profile/edit', userLogged, {user: req.user})
    } else {
        res.redirect('/');
    }
});

module.exports = router;
