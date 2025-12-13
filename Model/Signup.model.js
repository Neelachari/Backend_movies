const mongoose = require('mongoose');

const signupSchema = mongoose.Schema({
    UserID: { type: Number, required: false }, // Auto-generated ID, may be unnecessary
    Name: { type: String, required: true },
    email: { type: String, required: true },
    mobile_Number: { type: Number, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    Account_info: { type: [String], required: false }, // Array of account IDs
    status: { type: String, enum: ['active', 'blocked'], default: 'active' }, // User status
    createdAt: { type: Date, default: Date.now }
});

const SignupModel = mongoose.model('Movies_signup', signupSchema);

module.exports = SignupModel;
