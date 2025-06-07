const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const requireLogin = require('../middlewares/auth');

router.get('/admin', requireLogin, async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.render('admin', { title: 'Admin Panel', contacts });
});

module.exports = router;