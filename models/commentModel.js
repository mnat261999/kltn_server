const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      maxlength: 1000,
    },
    tag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      }
    ],
    reply: [
      {
        content: {
          type: String,
          maxlength: 1000,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
          }
        ],
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
        postId:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "post",
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
      }
    ],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    postId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
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
