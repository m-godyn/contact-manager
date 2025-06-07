const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/contact');
const requireLogin = require('../middlewares/auth');

router.get('/admin', requireLogin, async (req, res) => {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.render('admin', { title: 'Admin Panel', contacts });
});

router.get('/admin/delete/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).send('Error deleting contact');
    }
});

router.get('/admin/edit/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.json(contact);
    } catch (error) {
        res.status(500).json({ error: 'Error loading contact data' });
    }
});

router.post(
    '/admin/edit/:id', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { name, email } = req.body;
        try {
            const contact = await Contact.findByIdAndUpdate(req.params.id, { name, email });
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.json({ success: true, contact });
            }
            res.redirect('/admin');
        } catch (error) {
            if (req.xhr || req.headers.accept.includes('application/json')) {
                return res.status(500).json({ error: 'Error updating contact' });
            }
            res.status(500).send('Error updating contact');
        }
    }
);

module.exports = router;