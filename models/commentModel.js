const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    tag: Object,
    responds: [
      {
        content: {
          type: String,
          required: true,
          maxlength: 1000,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          },
        ],
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        hiden: {
          required: true,
          default: false,
          type: Boolean,
        },
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    hiden: {
      required: true,
      default: false,
      type: Boolean,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
