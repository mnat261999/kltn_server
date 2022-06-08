const Comments = require("../models/commentModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      const { postId, content, tag, response } = req.body;

      const newComment = new Comments({
        user: req.user._id,
        content,
        tag,
        response,
      });

      await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      );

      await newComment.save();

      res.json({ newComment });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;

      const cm = await Comments.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id,
        },
        { content }
      );

      if (!cm) return res.status(400).json({ msg: "Wrong!" });
      res.json({ msg: "Update success" });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = commentCtrl;
