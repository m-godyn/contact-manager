const Contact = require('../models/contact');

async function saveContact({ name, email }) {
    try {
        const newContact = new Contact({ name, email });
        await newContact.save();
        console.log(`📝 New contact saved: ${name} (${email})`);
        return { success: true, contact: newContact };
    } catch (error) {
        console.error('❌ Error saving contact:', error);
        
        if (error.code === 11000) {
            console.log(`⚠️ Duplicate email attempt: ${email}`);
            return { 
                success: false, 
                message: req.__('error.duplicateEmail') 
            };
        }
        return { 
            success: false, 
            message: req.__('error.saveContact') 
        };
    }
}

async function updateContact(id, { name, email }) {
    try {
        // First check if the email is already used by another contact
        const existingContact = await Contact.findOne({ email, _id: { $ne: id } });
        if (existingContact) {
            return {
                success: false,
                message: req.__('error.duplicateEmail')
            };
        }

        const contact = await Contact.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        );
        
        if (!contact) {
            return { 
                success: false, 
                message: req.__('error.contactNotFound') 
            };
        }
        
        return { success: true, contact };
    } catch (error) {
        console.error('Error updating contact:', error);
        return { 
            success: false, 
            message: req.__('error.updateContact') 
        };
    }
}

async function getAllContacts(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const [contacts, total] = await Promise.all([
            Contact.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
            Contact.countDocuments({})
        ]);
        
        return {
            success: true,
            contacts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return { 
            success: false, 
            message: req.__('error.fetchContacts') 
        };
    }
}

async function getContactById(id) {
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return { 
                success: false, 
                message: req.__('error.contactNotFound') 
            };
        }
        return { success: true, contact };
    } catch (error) {
        console.error('Error fetching contact:', error);
        return { 
            success: false, 
            message: req.__('error.fetchContact') 
        };
    }
}

async function deleteContact(id) {
    try {
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return { 
                success: false, 
                message: req.__('error.contactNotFound') 
            };
        }
        return { success: true };
    } catch (error) {
        console.error('Error deleting contact:', error);
        return { 
            success: false, 
            message: req.__('error.deleteContact') 
        };
    }
}

module.exports = { 
    saveContact, 
    updateContact, 
    getAllContacts, 
    getContactById, 
    deleteContact 
};