const Contact = require('../models/contact');

async function saveContact({ name, email }) {
    try {
        const newContact = new Contact({ name, email });
        await newContact.save();
        return { success: true, contact: newContact };
    } catch (error) {
        console.error('Error saving contact:', error);
        
        if (error.code === 11000) {
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

module.exports = { saveContact, updateContact };