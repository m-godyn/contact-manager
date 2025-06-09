const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
    getAllContacts, 
    getContactById, 
    updateContact, 
    deleteContact 
} = require('../controllers/contactController');
const requireLogin = require('../middlewares/auth');

router.use(requireLogin);

router.get('/admin', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await getAllContacts(page, limit);
    if (!result.success) {
        return res.status(500).send('Error loading contacts');
    }
    res.render('admin', { 
        title: 'Admin Panel', 
        contacts: result.contacts,
        pagination: result.pagination
    });
});

router.get('/admin/delete/:id', async (req, res) => {
    const result = await deleteContact(req.params.id);
    if (!result.success) {
        return res.status(500).send(result.message || 'Error deleting contact');
    }
    res.redirect('/admin');
});

router.get('/admin/edit/:id', async (req, res) => {
    const result = await getContactById(req.params.id);
    if (!result.success) {
        return res.status(404).json({ error: result.message });
    }
    res.json(result.contact);
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
                message: errors.array()[0].msg
            });
        }
        const { name, email } = req.body;
        
        const result = await updateContact(req.params.id, { name, email });
        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.json(result);
    }
);

module.exports = router;