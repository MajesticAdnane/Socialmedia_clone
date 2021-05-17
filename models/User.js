const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
    first_name: {
        type: String, 
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    secret_question: {
        type: String,
        required: true
    },

    secret_response: {
        type: String,
        required: true
    },

    friends: {
        type: [Schema.Types.ObjectId],
        default: []
    }

});

module.exports = User = model('user', UserSchema); 