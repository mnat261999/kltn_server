const Comments = require("../models/commentModel");
const Users = require('../models/userModel')
const Posts = require("../models/postModel");
const { mongoose } = require("mongoose");

const commentCtrl = {
	createComment: async (req, res) => {
		try {
			let { postId, content, tag } = req.body;

			if (!content && !tag) {
				return res.status(400).json({success: false,  msg: "You cannot submit comment empty" })
			}

			if (!content) { content = '' }

			if (!tag) { tag = [] }

			const newComment = new Comments({
				postedBy: req.user.id,
				content,
				tag,
				postId: postId
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
				success: true,
				data:newComment
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	updateComment: async (req, res) => {
		try {
			const comment = await Comments.findById(req.params.id)

			if (comment.postedBy != req.user.id) return res.status(400).json({success: false, msg: "You cannot udate comment" })

			let { content, tag } = req.body;

			if (!content && !tag) {
				return res.status(400).json({success: false, msg: "You cannot submit comment empty" })
			}

			if (!content) { content = '' }

			if (!tag) { tag = [] }

			const cm = await Comments.findOneAndUpdate(
				{
					_id: req.params.id,
					postedBy: req.user.id,
				},
				{ content, tag }
			);

			if (!cm) return res.status(400).json({success: false, msg: "Wrong!" });
			res.status(200).json({
				success: true,
				msg: "Update success"
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	getCommentByPost: async (req, res) => {
		try {
			const user = await Users.findById(req.user.id)

			const commentAll = await Comments.find({
				"postId": mongoose.Types.ObjectId(req.params.idPost)
			})

			const comments = await Comments.aggregate([
				{
					"$match": {
						"$and": [
							{
								"postId": mongoose.Types.ObjectId(req.params.idPost)
							},
							{
								"postedBy": {
									"$in": [...user.following, mongoose.Types.ObjectId(req.user.id)]
								}
							},
							{
								"postedBy": {
									"$nin": user.blockedUsers
								}
							},
							{
								"postedBy": {
									"$nin": user.blockedBy
								}
							}
						]
					}
				},
				{
					"$lookup": {
						"localField": "postedBy",
						"from": "users",
						"foreignField": "_id",
						"pipeline": [
							{
								"$project": {
									"_id": 1,
									"fullname": 1,
									"username": 1,
									"avatar": 1
								}
							},
							{
								"$match": {
									"$and": [
										{
											"_id": {
												"$in": [...user.following, mongoose.Types.ObjectId(req.user.id)]
											}
										},
										{
											"_id": {
												"$nin": user.blockedUsers
											}
										},
										{
											"_id": {
												"$nin": user.blockedBy
											}
										}
									]
								}

							}
						],
						"as": "userInfor"
					}
				}
			])

			console.log(comments)

			res.status(200).json({
				success: true,
				total: commentAll.length,
				data:comments,
			});
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	likeComment: async (req, res) => {
		try {
			const comment = await Comments.find({
				_id: req.params.id,
				likes: req.user.id,
			});


			if (comment.length != 0) return res.status(400).json({ msg: "You liked this comment." });

			await Comments.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$push: { likes: req.user.id },
				},
				{ new: true }
			);

			return res.status(200).json({ success: true })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	unLikeComment: async (req, res) => {
		try {
			await Comments.findOneAndUpdate(
				{ _id: req.params.id },
				{
					$pull: { likes: req.user.id },
				},
				{ new: true }
			);

			return res.status(200).json({ success: true })
		} catch (error) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteComment: async (req, res) => {
		try {
			await Comments.findOneAndDelete({
                _id: req.params.id,
                $or: [
                    {postedBy: req.user.id}
                ]
            })

			return res.status(200).json({ success: true })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	replyComment: async (req, res) => {
		try {
			let { commentId, content, tag } = req.body;

			if (!content && !tag) {
				return res.status(400).json({success: false, msg: "You cannot submit comment empty" })
			}

			if (!content) { content = '' }

			if (!tag) { tag = [] }

			const reply = {
				content: content,
				likes: [],
				tag: tag,
				postedBy: req.user.id,
				hiden: false
			};

			const comment = await Comments.findById(commentId)

			comment.reply.push(reply)

			await comment.save({ validateBeforeSave: false });

			res.status(200).json({
				success: true
			})


		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	updateReply : async (req, res) =>{
		try {
			let { commentId, content, tag } = req.body;

			if (!content && !tag) {
				return res.status(400).json({success: false, msg: "You cannot submit comment empty" })
			}

			if (!content) { content = '' }

			if (!tag) { tag = [] }

			const reply = {
				content: content,
				likes: [],
				tag: tag,
				postedBy: req.user.id,
				hiden: false
			};

			const comment = await Comments.findById(commentId)

			//console.log(comment.reply)

			const isReply = comment.reply.find(
				c => c._id.toString() == req.params.id
			)

			console.log(isReply)

			if(isReply.postedBy != req.user.id) return res.status(400).json({ msg: "You cannot update reply" })

			await Comments.updateOne(
				{ _id: mongoose.Types.ObjectId(commentId), "reply._id": mongoose.Types.ObjectId(req.params.id) },
				{ $set: { reply } }
			 )

			 res.status(200).json({
				success: true
			})

		
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
	deleteReply: async (req, res) =>{
		try {
			await Comments.deleteOne(
				{ _id: mongoose.Types.ObjectId(req.params.idComment), "reply._id": mongoose.Types.ObjectId(req.params.idReply), "reply.postedBy": mongoose.Types.ObjectId(req.user.id) }
            )

			return res.status(200).json({ success: true })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	}
};

module.exports = commentCtrl;
