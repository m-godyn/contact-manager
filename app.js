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
const helmet = require('helmet');
const csrf = require('csurf');
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

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
            fontSrc: ["'self'", "cdn.jsdelivr.net"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false, // Required for Bootstrap Icons
    crossOriginResourcePolicy: { policy: "cross-origin" } // Required for Bootstrap Icons
}));

app.set('trust proxy', 1); // Trust first proxy (needed for rate limiting to work with X-Forwarded-For)
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
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// CSRF Protection - only for authenticated routes
const csrfProtection = csrf({ cookie: true });

// Apply CSRF protection only to admin routes
app.use('/admin', csrfProtection);

// CSRF Error Handler
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // Handle CSRF token errors
        if (req.headers['accept']?.includes('json')) {
            return res.status(403).json({ error: 'Invalid CSRF token' });
        }
        return res.status(403).render('error', {
            message: 'Invalid CSRF token',
            status: 403,
            title: '403 - Forbidden'
        });
    }
    next(err);
});

// Make CSRF token available to all views (it will be undefined for non-CSRF routes)
app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken ? req.csrfToken() : null;
    next();
});

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
        console.log(`🚀 Application running on http://localhost:${PORT}`);
    });
}

module.exports = app;
