const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const CategorySchema = new Schema({
  title           : { type: String, required: true },
  description     : { type: String, required: true },
  postCount       : { type: Number, default: 0 },
},
{
 timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
