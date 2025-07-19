const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        const dbURI = process.env.DB_URI;
        if (!dbURI) {
            throw new Error('MONGO_URI is not defined in environment variables.');
        }

        await mongoose.connect(dbURI);

        console.log('Successfully connected to the database.');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        process.exit(1);
    }
};

module.exports = connectToDB;
