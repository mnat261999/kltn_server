const Users = require('../models/userModel')
const Avatars = require('../models/avatarModel')
const algoliasearch = require('algoliasearch')

const client = algoliasearch('KPC88LV7K0', 'bf9d249b2f37e1507a628474b318f57c')

const avatarCtrl = {
    updateAvatar: async (req, res) => {
        const {avatar} = req.body

        if(!avatar) return res.status(400).json({msg: "No avatar upload"})

        const newAvatar = new Avatars({
            avatar, user:req.user.id
        })

        let avatarNew = await newAvatar.save()

        avatar["avatarId"] = avatarNew._id

        await Users.findOneAndUpdate({_id: req.user.id}, {
            avatar:avatar
        })

        const index = client.initIndex('User')

        index.partialUpdateObject({
            avatar: avatar,
            objectID: req.user.id
        })

        res.json({msg: "Avatar is uploaded"})
    },
    getAllAvatarByUser: async (req, res) =>{
        const avatars = await Avatars.find({user:req.user.id})

        res.json({listAvatar:avatars})
    }
}

module.exports = avatarCtrl