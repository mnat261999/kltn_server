const Policies = require('../models/policyModel')

const policyCtrl = {
    createPolicy: async (req, res) => {
		try {
			const { content } = req.body;
            if (!content) {
				return res.status(400).json({success: false,  msg: "You cannot create policy empty" })
            }

            const newPolicy = new Policies({
                content:content
            })

            await newPolicy.save()

            return res.status(200).json({ success: true })
		} catch (err) {
			return res.status(500).json({ msg: err.message });
		}
	},
    updatePolicy: async (req, res) =>{
        try {
            const { content } = req.body;
            if (!content) {
				return res.status(400).json({success: false,  msg: "You cannot update policy empty" })
            }

            await Policies.findByIdAndUpdate(req.params.id,{
                content:content
            })

            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deletePolicy: async (req, res) =>{
        try {
            await Policies.findByIdAndDelete(req.params.id)

            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = policyCtrl;