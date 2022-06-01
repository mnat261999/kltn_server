const Users = require('../models/userModel')
const Covers = require('../models/coverModel')

const coverCtrl = {
    updateCover: async (req, res) => {
        const {cover} = req.body

        if(!cover) return res.status(400).json({msg: "No avatar upload"})

        await Users.findOneAndUpdate({_id: req.user.id}, {
            cover:cover
        })

        const newCover = new Covers({
            cover, user:req.user.id
        })

        await newCover.save()

        res.json({msg: "Cover is uploaded"})
    },
    getAllCoverByUser: async (req, res) =>{
        const covers = await Covers.find({user:req.user.id})

        res.json({listCover:covers})
    }
}

module.exports = coverCtrl