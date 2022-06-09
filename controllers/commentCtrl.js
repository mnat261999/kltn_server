const Comments = require("../models/commentModel");

const commentCtrl = {
  createComment: async (req, res) => {
    try {
      let { postId, content, tag} = req.body;

      if(!content && !tag){
        return res.status(400).json({ msg: "You cannot submit comment empty" })}

      if (!content){content = ''}

      if (!tag){tag = []}

      const newComment = new Comments({
        postedBy: req.user.id,
        content,
        tag,
        postId:postId
      });

/*       await Posts.findOneAndUpdate(
        { _id: postId },
        {
          $push: { comments: newComment._id },
        },
        { new: true }
      ); */

      await newComment.save();

      res.status(200).json({ 
        success:true,
        newComment 
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const comment = await Comments.findById(req.params.id)

      if(comment.postedBy != req.user.id) return res.status(400).json({ msg: "You cannot udate comment" })

      let { content, tag } = req.body;

      if(!content && !tag){
        return res.status(400).json({ msg: "You cannot submit comment empty" })}

      if (!content){content = ''}

      if (!tag){tag = []}

      const cm = await Comments.findOneAndUpdate(
        {
          _id: req.params.id,
          postedBy: req.user.id,
        },
        { content, tag}
      );

      if (!cm) return res.status(400).json({ msg: "Wrong!" });
      res.status(200).json({ 
        success:true,
        msg: "Update success" 
      });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = commentCtrl;
