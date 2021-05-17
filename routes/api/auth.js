const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../../middleware/auth');
const User = require('../../models/User');
const config = require('../../config');

const { JWT_SECRET } = config;
const router = Router();

router.post('/register', async (req, res) => {
    const { 
        firstName,
        lastName,
        email,
        password,
        secretQuestion,
        secretResponse
    } = req.body;

    if (!firstName || !lastName || !email || !password || !secretQuestion || !secretResponse) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const user = await User.findOne({ email });
        if (user) throw Error('User already exists');
    
        const salt = await bcrypt.genSalt(10);
        if (!salt) throw Error('Something went wrong with bcrypt');
    
        const hash = await bcrypt.hash(password, salt);
        if (!hash) throw Error('Something went wrong hashing the password');
    
        const newUser = new User({
            first_name: firstName,
            last_name: lastName,
            email,
            password: hash,
            secret_question: secretQuestion,
            secret_response: secretResponse
        });
    
        const savedUser = await newUser.save();
        if (!savedUser) throw Error('Something went wrong saving the user');
    
        const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
          expiresIn: 3600
        });
    
        res.status(200).json({
            token,
            user: {
                id: savedUser.id,
                firstName: savedUser.first_name,
                lastName: savedUser.last_name,
                email: savedUser.email,
            }
        });
        //res.status(400).json({msg: 'eroooour'})
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
  
    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (!user) throw Error('User does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
        if (!token) throw Error('Couldnt sign the token');

        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                friends: user.friends
            }
        });
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
});

router.get('/user', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) throw Error('User does not exist');
      res.json(user);
    } catch (e) {
      res.status(400).json({ msg: e.message });
    }
});

module.exports = router;