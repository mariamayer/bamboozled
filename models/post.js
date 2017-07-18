const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Answer   = require('./answer');

const PostSchema = new Schema({
  title           : { type: String, required: true },
  description     : { type: String, required: true },
  categories      : [{ type: String, required: true }],
  subscribedUsers : [{ type: Schema.Types.ObjectId, ref: 'User'}],
  _creator        : Schema.Types.Mixed,
  rating          : { type: Number, default: 0 },
  answers         : [{ type: Schema.Types.ObjectId, ref: 'Answer'}],
  imgUrl          : { type: String, default: "" },
},
{
 timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
