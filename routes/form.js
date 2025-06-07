const express = require('express');
const router = express.Router();

router.post('/contact', async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ status: 'error', message: 'Invalid data' });
    }

    console.log(`Received form: ${name}, ${email}`);
    await saveContact({ name, email });
    res.json({ status: 'success', message: 'Thank you, we will contact you at the provided email' });
});

module.exports = router;