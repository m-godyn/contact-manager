const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'contacts.json');

async function readContacts() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Błąd podczas odczytu pliku:', error);
        return [];
    }
}

async function saveContacts(contacts) {
    try {
        await fs.writeFile(filePath, JSON.stringify(contacts, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Błąd podczas zapisywania pliku:', error);
        throw new Error('Błąd podczas zapisu danych');
    }
}

module.exports = {
    readContacts,
    saveContacts
}; 