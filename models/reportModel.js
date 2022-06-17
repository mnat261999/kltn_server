const mongoose = require('mongoose')


const reportSchema = new mongoose.Schema({
    reportType:{
        type: String,
        required: true,
    },
    policies: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "policy",
    }],
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: Boolean,
        required: true,
    }
}, {
    timestamps: true
})


module.exports = mongoose.model('report', reportSchema)