const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    username: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true // Ensure usernames are unique
    },
    email: {
        type: String,
        required: true,
        maxlength: 50,
        unique: true, // Ensure emails are unique
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
