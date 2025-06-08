const request = require('supertest');
const app = require('../app');
const i18n = require('i18n');
const mongoose = require('mongoose');

let server;

beforeAll(async () => {
    // Close any existing connections first
    await mongoose.disconnect();
    await mongoose.connect('mongodb://localhost:27017/contact-manager-test');
    
    // Create a test server instance
    server = app.listen(0); // Use port 0 to get a random available port
  });

afterAll(async () => {
    // Close the server
    await new Promise((resolve) => server.close(resolve));
    
    // Drop the database and close the connection
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
  });

beforeEach(() => {
    // Reset i18n to default locale before each test
    i18n.setLocale('en');
});

test('should load default English translations', async () => {
const response = await request(app)
    .get('/')
    .set('Accept', 'text/html');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Contact Manager');
    expect(response.text).toContain('Welcome to Contact Manager!');
});

test('should switch to Polish language', async () => {
    const response = await request(app)
        .get('/lang/pl')
        .set('Accept', 'text/html');

    expect(response.status).toBe(302); // Redirect status
    expect(response.headers.location).toBe('/');

    // Follow the redirect and check the content
    const redirectedResponse = await request(app)
        .get('/')
        .set('Accept', 'text/html')
        .set('Cookie', ['lang=pl']);

    expect(redirectedResponse.text).toContain('Menedżer Kontaktów');
    expect(redirectedResponse.text).toContain('Witaj w Menedżerze Kontaktów!');
});

test('should switch to German language', async () => {
    const response = await request(app)
        .get('/lang/de')
        .set('Accept', 'text/html');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/');

    const redirectedResponse = await request(app)
        .get('/')
        .set('Accept', 'text/html')
        .set('Cookie', ['lang=de']);

    expect(redirectedResponse.text).toContain('Kontakt Manager');
    expect(redirectedResponse.text).toContain('Willkommen beim Kontakt Manager!');
});

test('should switch to Danish language', async () => {
    const response = await request(app)
        .get('/lang/dk')
        .set('Accept', 'text/html');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/');

    const redirectedResponse = await request(app)
        .get('/')
        .set('Accept', 'text/html')
        .set('Cookie', ['lang=dk']);

    expect(redirectedResponse.text).toContain('Kontakt Manager');
    expect(redirectedResponse.text).toContain('Velkommen til Kontakt Manager!');
});

test('should handle invalid language code', async () => {
    const response = await request(app)
        .get('/lang/invalid')
        .set('Accept', 'text/html');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/');

    const redirectedResponse = await request(app)
        .get('/')
        .set('Accept', 'text/html')
        .set('Cookie', ['lang=en']);

    // Should fall back to English
    expect(redirectedResponse.text).toContain('Contact Manager');
    expect(redirectedResponse.text).toContain('Welcome to Contact Manager!');
});
