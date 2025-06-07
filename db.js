const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Połączono z MongoDB');
    } catch (error) {
        console.error('❌ Błąd podczas łączenia z MongoDB:', error);
        process.exit(1);
    }
}

module.exports = { connectDB };