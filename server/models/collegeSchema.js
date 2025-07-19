const mongoose = require('mongoose');

const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    departments: {
        type: [String], 
        required: true
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"] 
    },
    status: {
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('College', CollegeSchema);