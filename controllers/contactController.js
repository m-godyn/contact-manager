const Contact = require('../models/contact');

async function saveContact({ name, email }) {
    const newContact = new Contact({ name, email });
    await newContact.save();
}

module.exports = { saveContact };