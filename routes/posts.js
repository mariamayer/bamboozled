const express = require('express');
const Post = require('../models/post');
const Category = require('../models/category');
const Answer = require('../models/answer');

const router  = express.Router();

router.get('/', (req, res, next) => {
  Post.find({}, (err, posts) => {
    if (err) { return next(err) }
    res.render('posts/index', {
      posts: posts
    });
  });
});

router.get('/new', (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) { return next(err) }
    res.render('posts/new', {
      categories: categories
    });
  });
});

router.post('/', (req, res, next) => {
  const newPost = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
  });

  newPost.save( (err) => {
    res.redirect('/');
  });
});

router.get('/:id', (req, res, next) => {
  const postId = req.params.id;

  Post.findById(postId, (err, post) => {
    if (err) { return next(err); }
    res.render('posts/post', { post: post });
  });
});

router.post('/:id', (req, res, next) => {
  let postId = req.params.id;

  Post.findById(postId, (err, post) => {
    const newAnswer = new Answer({
      description: req.body.description,
    });

    post.answers.push(newAnswer);

    post.save((err) => {
      res.redirect('/posts/'+postId);
    });
  });
});

module.exports = router;
