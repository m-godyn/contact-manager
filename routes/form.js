const express = require('express');
const router = express.Router();

router.post('/contact', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ status: 'error', message: 'Nieprawidłowe dane' });
    }

    console.log(`Otrzymano formularz: ${name}, ${email}`);
    await saveContact({ name, email });
    res.json({ status: 'success', message: 'Dziękujemy, odezwiemy się na podany adres' });
});

module.exports = router;