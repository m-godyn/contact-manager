const mongoose = require('mongoose');
const Contact = require('../models/contact');

beforeAll(async () => {
  // Close any existing connections first
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost:27017/contact-manager-test');
});

afterEach(async () => {
  // Clean up the database after each test
  await Contact.deleteMany({});
});

afterAll(async () => {
  // Drop the database and close the connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

test('saves a contact', async () => {
  const contact = new Contact({ name: 'Test', email: 'test@example.com' });
  const saved = await contact.save();

  expect(saved.name).toBe('Test');
  expect(saved.email).toBe('test@example.com');
});
