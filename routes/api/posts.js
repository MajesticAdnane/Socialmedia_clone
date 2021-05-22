const { Router } = require('express');
const router = Router();

const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');

router.post('/', auth, async (req, res) => {
    const newPost = new Post({
        user_id: req.user.id,
        post_date: req.body.postDate,
        content: req.body.content
    });

    try {
        const post = await newPost.save();
        if (!post) throw Error('Something went wrong saving the post');
    
        res.status(200).json(post);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.post('/:id/comments', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) throw Error('No post found');

        post.comments.push(req.body.comment);
        post.isNew = false;
        post.save();

        res.status(200).json({ id: req.params.id, comment: req.body.comment, msg: 'comment added'});
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) throw Error('No post found');
    
        if (req.user.id !== post.user_id) throw Error('You can\'t delete this post');

        const removed = await post.remove();
        if (!removed)
            throw Error('Something went wrong while trying to delete the post');
    
        res.status(200).json({ id: req.params.id, success: true });
    } catch (e) {
        res.status(400).json({ msg: e.message, success: false });
    }
});

router.get('/', auth, async (req, res) => {

    const userFriends = await User.findById(req.user.id).select('friends').friends;

    try {
        const posts = await Post.find({
            'user_id': {
                $in: [
                    ...userFriends,
                    req.user.id
                ]
            }
        }).sort({post_date: 'descending'});
        if (!posts) throw Error('No posts');
    
        res.status(200).json(posts);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

});

module.exports = router;


