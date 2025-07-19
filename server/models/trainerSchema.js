const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    trainerId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please provide a valid email address.'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        require: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please provide a valid 10-digit phone number.'],
    },
    specialization: {
        type: [String],
        required: true,
        default: [],
    },
    skills: {
        type: [String],
        default: [],
    },
    programsAssigned: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
    }],
    attendance: {
        type: [{
            date: {
                type: Date,
                required: true,
                index: true,
            },
            status: {
                type: String,
                enum: ['Present', 'Absent', 'Late'],
                required: true,
            },
        }],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isdefaultpassword:{
        type:Boolean,
        default:true
    }
});

trainerSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});


const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;
