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

// Hash the password before saving the user document
UserSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
