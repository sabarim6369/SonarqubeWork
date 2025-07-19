const mongoose = require('mongoose');
const { Schema } = mongoose;

const adminSchema = new Schema({
    adminId:{
        type: Number,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
