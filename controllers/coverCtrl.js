const Users = require('../models/userModel')
const Covers = require('../models/coverModel')

const coverCtrl = {
    updateCover: async (req, res) => {
        const {cover} = req.body

        if(!cover) return res.status(400).json({success: false, msg: "No avatar upload"})

        await Users.findOneAndUpdate({_id: req.user.id}, {
            cover:cover
        })

        const newCover = new Covers({
            cover, user:req.user.id
        })

        await newCover.save()

        res.status(200).json({ 
            success:true,
            msg: "Cover is uploaded"
        })
    },
    getAllCoverByUser: async (req, res) =>{
        const covers = await Covers.find({user:req.user.id})

        res.status(200).json({ 
            success:true,
            data:covers
        })
    }
}

module.exports = coverCtrl