const express = require('express');
const path = require('path');
const routes = require('./routes/pages');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const langRoutes = require('./routes/lang');
const { connectDB } = require('./middlewares/db');
const errorHandler = require('./middlewares/errorHandler');
const createAdminIfNotExists = require('./utils/createAdmin');
const session = require('express-session');
const i18n = require('i18n');
const cookieParser = require('cookie-parser');
require('dotenv').config();

i18n.configure({
    locales: ['en', 'pl', 'dk', 'de'],
    defaultLocale: 'en',
    directory: path.join(__dirname, 'locales'),
    cookie: 'lang',
    objectNotation: true,
    updateFiles: false,
    syncFiles: true
});

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(i18n.init);
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(routes);
app.use(langRoutes);
app.use(authRoutes);
app.use(adminRoutes);

app.use((req, res, next) => {
    const currentLang = req.cookies.lang || 'en';
    res.locals.currentLang = currentLang;
    next();
});

app.use((req, res, next) => {
    if (!res.headersSent) {
        res.status(404).render('error', {
            message: __("error.notFound"),
            status: 404,
            title: __("error.title", { status: 404 })
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
