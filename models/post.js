const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const Answer   = require('./answer');

const PostSchema = new Schema({
  title           : { type: String, required: true },
  description     : { type: String, required: true },
  categories      : [{ type: String, required: true }],
  subscribedUsers : [{ type: Schema.Types.ObjectId, ref: 'User'}],
  _creator        : { type: Schema.Types.ObjectId, ref: 'User'},
  raiting         : { type: Number, default: 0 },
  answers         : [Answer.schema],
  imgUrl          : { type: String, default: "" },
},
{
 timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
