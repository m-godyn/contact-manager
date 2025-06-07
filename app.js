const express = require('express');
const path = require('path');
const routes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const { connectDB } = require('./db');
const errorHandler = require('./middlewares/errorHandler');
const createAdminIfNotExists = require('./utils/createAdmin');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(routes);
app.use(adminRoutes);
app.use(authRoutes);

app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).render('error', {
            message: 'Nie znaleziono takiej strony',
            status: 404,
            title: '404 - Strona nie znaleziona'
        });
    } else {
        next();
    }
});

app.use(errorHandler);

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        createAdminIfNotExists(process.env.INITIAL_ADMIN_USERNAME, process.env.INITIAL_ADMIN_PASSWORD);
        console.log(`Application running on http://localhost:${PORT}`);
    });
}

module.exports = app;
