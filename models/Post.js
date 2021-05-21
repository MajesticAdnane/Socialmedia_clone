const { Schema, model } = require('mongoose');

const PostSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        required: true
    },

    post_date: { 
        type: Date,
        default: Date.now
    },

    content: {
        type: String, 
        required: true
    },

    comments: {
        type: [String],
        default: ['']
    },

});

module.exports = Post = model('post', PostSchema); 