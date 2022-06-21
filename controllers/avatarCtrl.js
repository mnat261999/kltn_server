const Users = require('../models/userModel')
const Avatars = require('../models/avatarModel')
const algoliasearch = require('algoliasearch')

const client = algoliasearch('KPC88LV7K0', 'bf9d249b2f37e1507a628474b318f57c')

const avatarCtrl = {
    updateAvatar: async (req, res) => {
        try {
            const { avatar } = req.body

            if (!avatar) return res.status(400).json({ success: false, msg: "No avatar upload" })

            const newAvatar = new Avatars({
                avatar, user: req.user.id
            })

            let avatarNew = await newAvatar.save()

            avatar["avatarId"] = avatarNew._id

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                avatar: avatar
            })

            res.status(200).json({
                success: true,
                msg: "Avatar is uploaded"
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllAvatarByUser: async (req, res) => {
        try {
            const avatars = await Avatars.find({ user: req.user.id })

            res.status(200).json({
                success: true,
                data: avatars
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllAvatarByIdUser: async (req, res) => {
        try {
            const avatars = await Avatars.find({ user: req.params.id })

            res.status(200).json({
                success: true,
                data: avatars
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteAvatar: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const avatar = await Avatars.findById(req.params.id)

            if (user._id.toString() != avatar.user.toString()) return res.status(400).json({ success: false, msg: "You can only delete avatar created by you" })

            if (user.avatar.avatarId.toString() === req.params.id) {
                await Users.findOneAndUpdate({ _id: req.user.id }, {
                    avatar: {}
                })
            }

            await Avatars.findByIdAndDelete(req.params.id)

            res.status(200).json({
                success: true
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = avatarCtrl