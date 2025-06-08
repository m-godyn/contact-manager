const express = require('express');
const router = express.Router();

router.get('/lang/:locale', (req, res) => {
    const locale = req.params.locale;
    
    if (['en', 'pl', 'dk', 'de'].includes(locale)) {
        res.cookie('lang', locale, { 
            maxAge: 900000, 
            httpOnly: true,
            path: '/',
            sameSite: 'lax'
        });
        res.setLocale(locale);
    }
    
    // Always redirect to home page after language change
    res.redirect('/');
});

module.exports = router;