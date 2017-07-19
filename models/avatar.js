const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const avatarSchema = new Schema({
  avatarPath: String,
  avatarName: String
},
{
 timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

const Avatar = mongoose.model('Avatar', avatarSchema);

module.exports = Avatar;
