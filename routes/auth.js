const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', error: null, logoutMessage: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { title: 'Login', error: 'Username or password is incorrect', logoutMessage: null });
    }

    req.session.userId = user._id;
    res.redirect('/admin');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.render('login', { title: 'Login', error: null, logoutMessage: 'You have been logged out' });
    });
});

module.exports = router;