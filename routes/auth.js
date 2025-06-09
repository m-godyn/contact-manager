const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const requireLogin = require('../middlewares/auth');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts, please try again after 5 minutes',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: req.__('error.loginRateLimit')
        });
    }
});

router.get('/login', (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/admin');
    }
    res.render('login', { title: 'Login', error: null, logoutMessage: null });
});

router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.render('login', { 
            title: 'Login', 
            error: req.__('login.invalidCredentials'), 
            logoutMessage: null 
        });
    }

    req.session.userId = user._id;
    res.redirect('/admin');
});

router.get('/logout', requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.render('login', { title: 'Login', error: null, logoutMessage: 'You have been logged out' });
    });
});

module.exports = router;