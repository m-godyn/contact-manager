const express = require('express');
const router = express.Router();

router.get('/lang/:locale', (req, res) => {
    const locale = req.params.locale;
    console.log('Switching to locale:', locale);
    
    if (['en', 'pl'].includes(locale)) {
        res.cookie('lang', locale, { 
            maxAge: 900000, 
            httpOnly: true,
            path: '/',
            sameSite: 'lax'
        });
        res.setLocale(locale);
        console.log('Cookie set to:', locale);
    }
    
    // Always redirect to home page after language change
    res.redirect('/');
});

module.exports = router;