const mongoose = require('mongoose')


const policySchema = new mongoose.Schema({
    content: {
        type: String,
        required:true
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('policy', policySchema)