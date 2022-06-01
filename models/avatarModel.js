const mongoose = require('mongoose')


const avatarSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    url:{
        type: String,
        required: true   
    },
    checkNow:{
        type: Boolean, 
        default: true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('avatar', avatarSchema)