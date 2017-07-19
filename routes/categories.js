const express = require('express');
const Category = require('../models/category');
const Post = require('../models/post');

const router  = express.Router();

//Display categories
router.get('/', (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) { return next(err) }
    res.render('posts/categories', {
      categories: categories
    });
  });
});

//Display categories
router.get('/:title', (req, res, next) => {

  Post.find( {"categories" : {$in: [req.params.title] }}, (err, posts) => {
    if (err) { return next(err) }
    res.render('posts/category', {
      posts: posts,
      title:req.params.title,
    });
  });

});

//Add category
router.post('/', (req, res, next) => {
  const newCategory = new Category({
    title: req.body.title,
    description: req.body.description,
  });

  newCategory.save( (err) => {
    res.redirect('/categories/');
  });
});

module.exports = router;
