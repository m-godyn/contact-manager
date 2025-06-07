const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Contact = require('../models/contact');
const express = require('express');

let server;

beforeAll(async () => {
  // Close any existing connections first
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost:27017/contact-manager-test');
  
  // Create a test server instance
  server = app.listen(0); // Use port 0 to get a random available port
});

afterEach(async () => {
  // Clean up the database after each test
  await Contact.deleteMany({});
});

afterAll(async () => {
  // Close the server
  await new Promise((resolve) => server.close(resolve));
  
  // Drop the database and close the connection
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

test('POST /contact with valid data returns 200', async () => {
  const res = await request(server).post('/contact').send({
    name: 'Test User',
    email: 'test@example.com'
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.success).toBe(true);
});

test('POST /contact with invalid email returns 400', async () => {
  const res = await request(server).post('/contact').send({
    name: 'Invalid Email',
    email: 'not-an-email'
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.errors).toBeDefined();
});
