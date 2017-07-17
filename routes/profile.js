const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res, next) => {
  User.find({}, (err, posts) => {
    if (err) { return next(err) }
    res.render('profile', {
      user: user
    });
  });
});


// router.get('/:id', (req, res, next) => {
//     const userId = req.params.id;
//     User.findById(userId, (err, users) => {
//         if (err) { return next(err) }
//         res.render('profile', {
//             user: user
//         });
//     });
// });

module.exports = router;