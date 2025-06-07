const express = require('express');
const path = require('path');
const { saveContact } = require('../controllers/contactController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// static pages
router.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

router.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express backend!' });
});

// form handling
router.post(
    '/contact', 
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

        const result = await saveContact({ name, email });
        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            message: `Thank you, ${name}. We'll contact you at ${email}.`
        });
    }
);

module.exports = router;