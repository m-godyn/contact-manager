const express = require('express');
const path = require('path');
const { saveContact } = require('../utils/contactController');

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
router.post('/contact', async (req, res) => {
    const { name, email } = req.body;

    try {
        await saveContact({ name, email });

        res.json({
            status: 'success', 
            message: `Dziękujemy, ${name}. Odezwiemy się na ${email}.`,
        });
    } catch (error) {
        console.error('Błąd podczas zapisywania danych:', error);
        res.status(500).json({
            status: 'error',
            message: 'Wystąpił błąd przy zapisie kontaktu.' 
        });
    }
});

module.exports = router;