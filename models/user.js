const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email           : { type: String, required: true },
    name            : { type: String, default: '' },
    password        : { type: String, required: true },
    // timestamps      : { createdAt: "created_at", updatedAt: "updated_at" },
    answersPosted   : { type: Number, default: 0 },
    questionsPosted : { type: Number, default: 0 },
    age             : { type: Number, default: 18 },
    gender          : { type: String, default: 'Male' },
    role            : { type: String, default: '' },
    bio             : { type: String, default: '' },
    avatar          : { type: String, default: "" }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
