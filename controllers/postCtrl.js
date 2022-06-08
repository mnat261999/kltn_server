const Posts = require("../models/postModel");
const { post } = require("../routes/postRouter");

const postCtrl = {
  createPost: async (req, res) => {
    try {
      const { content, images } = req.body;

      if (content.lenght === 0 && images.lenght === 0) {
        return res
          .status(400)
          .json({ msg: "Please enter the content or Photo" });
      }
      const newPost = new Posts({
        content,
        images,
        postedBy: req.user._id,
      });
      await newPost.save();

      res.json({
        msg: "Create Post!",
        newPost,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getPosts: async (req, res) => {
    try {
      const allPosts = await Posts.find({
        user: [...req.user.following, req.user._id],
      })
        .sort("-CreateAt")
        .populate("user likes", "avatar username fullname");

      const posts = [];
      allPosts.forEach((item) => {
        if (!allPosts._id.includes(req.user.blockedUsers)) {
          posts.push(item);
        }
      });

      res.json({
        msg: "Succsess!",
        result: posts.length,
        posts,
      });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { content, images } = req.body;

      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          content,
          images,
        }
      ).populate("user likes", "avatar username fullname");

      res.json({
        msg: "Update Post!",
        newPost: {
          ...post._doc,
          content,
          images,
        },
      });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Posts.find({
        _id: req.params.id,
        likes: req.user._id,
      });
      if (post) return res.status(400).json({ msg: "You liked this post." });

      await Posts.findOneAndUpdate(
        { _id: req.params.id },
        {
          $push: { likes: req.user._id },
        },
        { new: true }
      );
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unLikePost: async (req, res) => {
    try {
      await Posts.findOneAndUpdate(
        { _id: req.params._id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = postCtrl;
