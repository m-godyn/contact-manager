function errorHandler(err, req, res, next) {
    console.error(err.stack);

    const status = res.statusCode || 500;
    const message = err.message || 'Something went wrong';

    if (req.headers['accept']?.includes('json')) {
        res.status(status).json({
            error: message,
        });
    } else {
        res.status(status).render('error', {
            message,
            status,
            title: `${status} - Error`
        });
    }
}

module.exports = errorHandler;