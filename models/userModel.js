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
    avatar:{
        type:Object,
        default:{}
    },
    cover:{
        type: Object,
        default:{}
    },
    role: {
        type: String, 
        default: 'user'
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    address: {
        type: String, 
        default: ''
    },
    website: {
        type: String, 
        default: ''
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }],
    blockedUsers:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }],
    blockedBy:[{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }],
    request: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
    }]
}, {
    timestamps: true,
    minimize:false
})


module.exports = mongoose.model('user', userSchema)