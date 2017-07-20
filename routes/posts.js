const express = require('express');
const Post = require('../models/post');
const Category = require('../models/category');
const Answer = require('../models/answer');
const User = require('../models/user');
const { ensureLoggedIn }  = require('connect-ensure-login');
const nodemailer = require('nodemailer');

const router  = express.Router();

//Index
router.get('/', (req, res, next) => {
  Post.find({}, (err, post) => {
    if (err){ return next(err); }

    post.populate('_creator', (err, post) => {
      if (err){ return next(err); }
      Category.find({}, (err, categories) => {
        if (err) { return next(err) }
        return res.render('posts/index', { posts: posts,categories: categories });
      });
    });
  });
});

//Show upload post form
router.get('/new',ensureLoggedIn('/login'), (req, res, next) => {
  let userLogged = true;
  let user = req.user;

  Category.find({}, (err, categories) => {
    if (err) { return next(err) }
    res.render('posts/new', {
      categories: categories,
      userLogged, user
    });
  });

});

//Post a post
router.post('/',ensureLoggedIn('/login'), (req, res, next) => {
  let userId = req.user.id;

  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    _creator: req.user
  });
  User.findByIdAndUpdate(userId, { $inc: { questionsPosted: 1 }}, function(err, data){
      if (err){ return next(err); }
   });

  newPost.save( (err) => {
    console.log(err)
    res.redirect('/');
  });
});

//Show post view
router.get('/:id', (req, res, next) => {
  let userLogged = false;
  if (req.user) {
    userLogged = true;
  }
  let user = req.user;

  Post.findById(req.params.id)
  .populate({path: 'answers', options: { sort: { 'rating': -1 } }})
  .exec(function(err, post) {
    if (err){ return next(err); }
    return res.render('posts/post', {
      post: post,
      answers:post.answers,
      categories:post.categories,
      userLogged,
      user,
      date:post.created_at
    });
  });
});


//Increment rating
router.post('/rate', function (req, res) {
  Answer.findByIdAndUpdate(req.body.id, { $inc: { rating: 1 }}, function(err, data){
      if (err){ return next(err); }
      res.redirect('/');
   });
});

//Subscribe to post
router.post('/subscribe', function (req, res) {
  Post.findById(req.body.id, function(err, post){
    post.subscribedUsers.push(req.user.id);
      post.save( (err) => {
        res.redirect('/');
      });
   });
});

//Answer post
router.post('/:id', (req, res, next) => {
  let postId = req.params.id;
  let userId = req.user.id;

  Post.findById(postId, (err, post) => {
    const newAnswer = new Answer({
      description: req.body.description,
      _creator: req.user,
    });

    User.findByIdAndUpdate(userId, { $inc: { answersPosted: 1 }}, function(err, data){
        if (err){ return next(err); }
     });

    newAnswer.save( (err,answer) => {
      post.answers.push(answer._id);
      post.save( (err) => {
        res.redirect('/posts/'+postId);
      });
    });

    //Send notification to subscribed Users

    let receiversIds = post.subscribedUsers;
    let receivers = [];

    receiversIds.forEach(receiversId => {
      User.findById(receiversId, (err, user) => {
        receivers.push(user.email);
      });
    });

    let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ckchristiana@gmail.com',
        pass: 'chr1sper1'
      }
    });

    const text = post.title + '\n' + post.description + '\n' + newAnswer.description;

    var mailOptions = {
        from: '<ckchristiana@gmail.com>',
        to: receivers,
        subject: 'New notification from Bamboozled...!',
        text: text
    };


    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log('----------------------------------', error,'----------------------------------');
            res.json({yo: 'error'});
        }else{
            console.log('----------------------------------', 'Message sent: ' , info.response);
            res.json({yo: info.response});
        };
    });

  });
});

module.exports = router;
