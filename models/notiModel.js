const mongoose = require('mongoose')


const notiSchema = new mongoose.Schema({
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    userTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    notificationType:{
        type: String,
        required:true
    },
    url:{
        type: String,
        required: true
    },
    isRead: {
        type: Boolean, 
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('noti', notiSchema)