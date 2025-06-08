const request = require('supertest');
const app = require('../app');
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

test("GET /admin without login -> redirect to login", async () => {
    const res = await request(app).get('/admin');
    expect(res.status).toBe(302);
    expect(res.header.location).toBe('/login');
});