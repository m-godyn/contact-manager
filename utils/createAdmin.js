require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const MONGO_URL = process.env.MONGO_URL;

function createAdminIfNotExists(username, plainPassword) {
    mongoose.connect(MONGO_URL)
        .then(async () => {
            console.log('👤 Creating admin user...');

            const existing = await User.findOne({ username });
            if (existing) {
                console.log('ℹ️ Admin user already exists');
                return;
            }

            const hashed = await bcrypt.hash(plainPassword, 10);
            const user = new User({ username, password: hashed });
            await user.save();
            console.log('✅ Admin user created successfully!')
        })
        .catch(console.error);
}

module.exports = createAdminIfNotExists;