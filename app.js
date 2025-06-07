const express = require('express');
const path = require('path');
const routes = require('./routes/pages');
const { connectDB } = require('./db');
const errorHandler = require('./middlewares/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);

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
        console.log(`Application running on http://localhost:${PORT}`);
    });
}

module.exports = app;
