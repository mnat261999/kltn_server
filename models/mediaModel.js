const mongoose = require('mongoose')


const mediaSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
    },
    media:{
        type: Object,
        required: true   
    },
    typeMedia:{
        type: String,
        required: true   
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('media', mediaSchema)