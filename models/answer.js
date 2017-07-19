const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const answerSchema = new Schema({
  description     : { type: String, required: true },
  _creator        : Schema.Types.Mixed,
  rating          : { type: Number, default: 0 },
  imgUrl          : { type: String, default: "" },
},
{
 timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;
