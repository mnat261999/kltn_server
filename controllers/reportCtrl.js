const Reports = require("../models/reportModel");
const reportCtrl = {
    report: async (req, res) => {
        try {
            const {reportType, policies, reportId} = req.body

            if(!reportType) res.status(400).json({ success: false, msg: "Please fill in reportType." })

            if(!policies) res.status(400).json({ success: false, msg: "Please fill in policies." })

            if(!reportId) res.status(400).json({ success: false, msg: "Please fill in policies." })

            let newReport

            if(reportType == 'post'){
                newReport =  new Reports({
                    reportType, policies, post:reportId, sentBy:req.user.id
                })
            } else if (reportType == 'comment'){
                newReport =  new Reports({
                    reportType, policies, comment:reportId, sentBy:req.user.id
                })
            } else if(reportType == 'user'){
                newReport =  new Reports({
                    reportType, policies, userId:reportId, sentBy:req.user.id
                })
            }

            await newReport.save()

            return res.status(200).json({ success: true })
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

module.exports = reportCtrl;