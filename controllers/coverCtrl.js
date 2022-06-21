const Users = require('../models/userModel')
const Covers = require('../models/coverModel')

const coverCtrl = {
    updateCover: async (req, res) => {
        try {
            const {cover} = req.body

            if(!cover) return res.status(400).json({success: false, msg: "No avatar upload"})
    
            await Users.findOneAndUpdate({_id: req.user.id}, {
                cover:cover
            })
    
            const newCover = new Covers({
                cover, user:req.user.id
            })
    
            let coverNew = await newCover.save()
    
            cover["coverId"] = coverNew._id
    
            await Users.findOneAndUpdate({ _id: req.user.id }, {
                cover: cover
            })
    
            res.status(200).json({ 
                success:true,
                msg: "Cover is uploaded"
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllCoverByUser: async (req, res) =>{
        try {
            const covers = await Covers.find({user:req.user.id})

            res.status(200).json({ 
                success:true,
                data:covers
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAllCoverByIdUser: async (req, res) =>{
        try {
            const covers = await Covers.find({user:req.params.id})

            res.status(200).json({ 
                success:true,
                data:covers
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteCover: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const cover = await Covers.findById(req.params.id)

            if (user._id.toString() != cover.user.toString()) return res.status(400).json({ success: false, msg: "You can only delete cover created by you" })

            if (user.cover.coverId.toString() === req.params.id) {
                await Users.findOneAndUpdate({ _id: req.user.id }, {
                    cover: {}
                })
            }

            await Covers.findByIdAndDelete(req.params.id)

            res.status(200).json({
                success: true
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = coverCtrl