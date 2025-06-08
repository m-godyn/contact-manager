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
                message: 'This email is already registered in our system.' 
            };
        }
        return { 
            success: false, 
            message: 'An error occurred while saving the contact.' 
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
                message: 'This email is already registered in our system.'
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
                message: 'Contact not found' 
            };
        }
        
        return { success: true, contact };
    } catch (error) {
        console.error('Error updating contact:', error);
        return { 
            success: false, 
            message: 'An error occurred while updating the contact.' 
        };
    }
}

async function getAllContacts() {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        return { success: true, contacts };
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return { 
            success: false, 
            message: 'An error occurred while fetching contacts.' 
        };
    }
}

async function getContactById(id) {
    try {
        const contact = await Contact.findById(id);
        if (!contact) {
            return { 
                success: false, 
                message: 'Contact not found' 
            };
        }
        return { success: true, contact };
    } catch (error) {
        console.error('Error fetching contact:', error);
        return { 
            success: false, 
            message: 'An error occurred while fetching the contact.' 
        };
    }
}

async function deleteContact(id) {
    try {
        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return { 
                success: false, 
                message: 'Contact not found' 
            };
        }
        return { success: true };
    } catch (error) {
        console.error('Error deleting contact:', error);
        return { 
            success: false, 
            message: 'An error occurred while deleting the contact.' 
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