const express = require('express');
const Post = require('../models/post');
const Category = require('../models/category');
const Answer = require('../models/answer');
const { ensureLoggedIn }  = require('connect-ensure-login');

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
  Category.find({}, (err, categories) => {
    if (err) { return next(err) }
    res.render('posts/new', {
      categories: categories
    });
  });
});

//Post a post
router.post('/',ensureLoggedIn('/login'), (req, res, next) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    categories: req.body.categories,
    _creator: req.user
  });

  newPost.save( (err) => {
    console.log(err)
    res.redirect('/');
  });
});

//Show post view
router.get('/:id', (req, res, next) => {
  let userLogged=false;
  if(req.user){
    userLogged=true;
  }
  Post.findById(req.params.id)
  .populate({path: 'answers'})
  .exec(function(err, post) {
    if (err){ return next(err); }
    return res.render('posts/post', { post: post,answer:post.answers,categories:post.categories,userLogged:userLogged });
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

  Post.findById(postId, (err, post) => {
    const newAnswer = new Answer({
      description: req.body.description,
      _creator: req.user,
    });

    newAnswer.save( (err,answer) => {
      post.answers.push(answer._id);
      post.save( (err) => {
        res.redirect('/posts/'+postId);
      });
    });
  });
});

module.exports = router;
