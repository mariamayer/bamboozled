const express = require('express');
const Category = require('../models/category');

const router  = express.Router();

router.get('/', (req, res, next) => {
  Category.find({}, (err, categories) => {
    if (err) { return next(err) }
    res.render('posts/categories', {
      categories: categories
    });
  });
});

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
