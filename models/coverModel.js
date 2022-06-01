const mongoose = require('mongoose')


const coverSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    cover:{
        type: Object,
        required: true   
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('cover', coverSchema)