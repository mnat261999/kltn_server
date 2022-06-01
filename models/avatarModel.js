const mongoose = require('mongoose')


const avatarSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    avatar:{
        type: Object,
        required: true   
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('avatar', avatarSchema)