const Users = require('../models/userModel')
const Avatars = require('../models/avatarModel')

const avatarCtrl = {
    updateAvatar: async (req, res) => {
        const {avatar} = req.body

        if(!avatar) return res.status(400).json({msg: "No avatar upload"})

        await Users.findOneAndUpdate({_id: req.user.id}, {
            avatar:avatar
        })

        const newAvatar = new Avatars({
            avatar, user:req.user.id
        })

        await newAvatar.save()

        res.json({msg: "Avatar is uploaded"})
    },
    getAllAvatarByUser: async (req, res) =>{
        const avatars = await Avatars.find({user:req.user.id})

        res.json({listAvatar:avatars})
    }
}

module.exports = avatarCtrl