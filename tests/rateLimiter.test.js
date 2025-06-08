const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

let server;

beforeAll(async () => {
  // Close any existing connections first
  await mongoose.disconnect();
  await mongoose.connect('mongodb://localhost:27017/contact-manager-test');
  
  // Create a test server instance
  server = app.listen(0);
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.close();
});

describe('Contact Form Rate Limiter Tests', () => {
  const getContactData = (index) => ({
    name: `Test User ${index}`,
    email: `test${index}@example.com`
  });

  test('should allow 3 contact form submissions within a minute', async () => {
    // Make 3 requests
    for (let i = 0; i < 3; i++) {
      const response = await request(server)
        .post('/contact')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(getContactData(i));
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    }
  });

  test('should block the 4th contact form submission within a minute', async () => {
    // Make 3 requests first
    for (let i = 0; i < 3; i++) {
      await request(server)
        .post('/contact')
        .set('X-Forwarded-For', '127.0.0.1')
        .send(getContactData(i + 10)); // Use different emails
    }

    // The 4th request should be blocked
    const response = await request(server)
      .post('/contact')
      .set('X-Forwarded-For', '127.0.0.1')
      .send(getContactData(13));

    expect(response.status).toBe(429);
    expect(response.body).toHaveProperty('message', 'Too many requests from this IP, please try again after a minute');
  });

  test('should allow contact form submissions from different IPs', async () => {
    // Make 3 requests from first IP
    for (let i = 0; i < 3; i++) {
      const response1 = await request(server)
        .post('/contact')
        .set('X-Forwarded-For', '192.168.1.1')
        .send(getContactData(i + 20)); // Use different emails
      
      expect(response1.status).toBe(200);
      expect(response1.body.success).toBe(true);
    }

    // Make 3 requests from second IP
    for (let i = 0; i < 3; i++) {
      const response2 = await request(server)
        .post('/contact')
        .set('X-Forwarded-For', '192.168.1.2')
        .send(getContactData(i + 30)); // Use different emails
      
      expect(response2.status).toBe(200);
      expect(response2.body.success).toBe(true);
    }
  });

  test('should include rate limit headers in contact form response', async () => {
    const response = await request(server)
      .post('/contact')
      .set('X-Forwarded-For', '127.0.0.2')
      .send(getContactData(40));

    expect(response.headers).toHaveProperty('ratelimit-limit');
    expect(response.headers).toHaveProperty('ratelimit-remaining');
    expect(response.headers).toHaveProperty('ratelimit-reset');
  });
}); 