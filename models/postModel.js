const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    images: {
      type: Array,
      default: [],
    },
    content: {
      type: String,
      maxlength: 1000,
    },
    userTag: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment",
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
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
