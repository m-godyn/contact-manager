const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { title: 'Login', error: 'Username or password is incorrect' });
    }

    req.session.userId = user._id;
    res.redirect('/admin');
});

module.exports = router;