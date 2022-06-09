const Posts = require("../models/postModel");
const Medias = require("../models/mediaModel")
const Users = require('../models/userModel')
const { mongoose } = require("mongoose");

const postCtrl = {
    createPost: async (req, res) => {
        try {
            const { content, medias } = req.body;

            if(!content && !medias){
                return res.status(400).json({ msg: "You cannot submit status empty" })
            }else if(content && medias){
                const newPost = new Posts({
                    content:content, postedBy: req.user.id
                })

                const post = await newPost.save()

                for (const m of medias){
                    await addMedia(post._id, m.media, m.typeMedia)
                }

                return res.status(200).json({ success: true})
            } else if (content && !medias){
                const newPost = new Posts({
                    content:content, postedBy: req.user.id
                })

                await newPost.save()

                return res.status(200).json({ success: true})
            } else if (medias && !content){
                const newPost = new Posts({
                    content:'',postedBy: req.user.id
                })

                const post = await newPost.save()

                for (const m of medias){
                    await addMedia(post._id, m.media, m.typeMedia)
                }

                return res.status(200).json({ success: true})
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    getPosts: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id) 

            const allPosts = await Posts.aggregate([
                {
                  "$lookup": {
                    "from": "media",
                    "localField": "_id",
                    "foreignField": "post",
                    "as": "medias"
                  }
                },
                {
                    "$lookup": {
                      "from": "users",
                      "localField": "postedBy",
                      "foreignField": "_id",
                      "pipeline" : [
                          {
                              "$project":{
                                "_id": 1,
                                "fullname": 1,
                                "username": 1,
                                "avatar": 1
                            }
                          }
                      ] ,
                      "as": "userInfor"
                    }
                },
                {
                  "$match": {
                    "$and": [
                      {
                        "postedBy": {
                          "$in": [...user.following,mongoose.Types.ObjectId(req.user.id)]
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
                }
              ])

            res.status(200).json({
                success:true,
                result: allPosts.length,
                allPosts,
            });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updatePost: async (req, res) => {
        try {
            const { content, medias, mediaIdDeleteList } = req.body;

            if(mediaIdDeleteList){
                await Medias.deleteMany({'_id':{'$in':mediaIdDeleteList}})
            }

            if(!content && !medias){
                return res.status(400).json({ msg: "You cannot submit status empty" })
            }else if(content && medias){

                await Posts.findOneAndUpdate({ _id: req.params.id },{content:content})

                const post = await Posts.findById(req.params.id)

                for (const m of medias){
                    await addMedia(post._id, m.media, m.typeMedia)
                }

                return res.status(200).json({ success: true})
            }else if (content && !medias){
                await Posts.findOneAndUpdate({ _id: req.params.id },{content:content})

                return res.status(200).json({ success: true})
            }else if(!content && medias){
                const post = await Posts.findById(req.params.id)

                for (const m of medias){
                    await addMedia(post._id, m.media, m.typeMedia)
                }

                return res.status(200).json({ success: true})
            }

        } catch (err) {
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

const addMedia = async (idPost, media, typeMedia) =>{
    const newMedia = new Medias({
        post:idPost, media:media, typeMedia:typeMedia
    })
     return await newMedia.save()
}

module.exports = postCtrl;
