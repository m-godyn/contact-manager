const express = require('express');
const path = require('path');
const { saveContact } = require('../controllers/contactController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// static pages
router.get('/', (req, res) => {
    res.render('index', { title: 'Strona główna' });
});

router.get('/about', (req, res) => {
    res.render('about', { title: 'O nas' });
});

router.get('/api/hello', (req, res) => {
    res.json({ message: 'Witaj z backendu Express!' });
});

// form handling
router.post(
    '/contact', 
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { name, email } = req.body;

        try {
            await saveContact({ name, email });
            res.json({
                success: true,
                message: `Dziękujemy, ${name}. Odezwiemy się na ${email}.`
            });
        } catch (error) {
            console.error('Błąd podczas zapisywania danych:', error);
            res.status(500).json({
                success: false,
                errors: ['Wystąpił błąd przy zapisie kontaktu.']
            });
        }
});

module.exports = router;