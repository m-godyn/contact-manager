const express = require('express');
const path = require('path');
const { saveContact } = require('../controllers/contactController');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Configure rate limiter for contact route
const contactLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // limit each IP to 3 requests per windowMs
    message: 'Too many requests from this IP, please try again after a minute',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        res.status(429).json({
            message: req.__('error.rateLimit')
        });
    }
});

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
    contactLimiter,
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