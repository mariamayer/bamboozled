const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email           : { type: String },
    name            : { type: String, default: '' },
    password        : { type: String },
    answersPosted   : { type: Number, default: 0 },
    questionsPosted : { type: Number, default: 0 },
    age             : { type: Number, default: 18 },
    gender          : { type: String, default: '' },
    role            : { type: String, enum: ['ADMIN', 'GUEST'], default: 'GUEST' },
    bio             : { type: String, default: '' },
    avatar          : { type: String, default: '../images/avatar.png'},
    facebookID      : { type: String },
    googleID        : { type: String }
}, {
    timestamps      : { createdAt: "created_at", updatedAt: "updated_at" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

