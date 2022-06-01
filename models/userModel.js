const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {type: String, default: 'user'},
    gender: {type: String},
    dob: {type: Date},
    address: {type: String, default: ''}
}, {
    timestamps: true
})


module.exports = mongoose.model('user', userSchema)