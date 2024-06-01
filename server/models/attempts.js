const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        unique: true,
        lowercase: true
    },    
    test_code: { type: String, default: "none" },    
}, { timestamps: true });


module.exports = mongoose.model('Attempts', attemptSchema);