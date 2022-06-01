const config = require('aws-sdk');
const { file } = require('googleapis/build/src/apis/file');
const { v4: uuidv4 } = require('uuid');


const s3 = new config.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const uploadCtrl = {
    uploadAvatar:async (req, res) =>{
        try {
            const files = req.files; 
            if(files[0].mimetype !== 'image/jpeg' && files[0].mimetype !== 'image/png'){
                return res.status(400).json({msg: "File format is incorrect."})
            }
            const avatars = []

            for(var i = 0; i<files.length;i++){
                const params = {
                    Bucket: `${process.env.AWS_PUBLIC_BUCKET_NAME}/avatar`,
                    Key: `${uuidv4()}${files[i].originalname}`,
                    Body: `${uuidv4()}-${files[i].originalname}`,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                const avatar = {
                    key: uploadResult.Key,
                    url: uploadResult.Location
                }

                avatars.push(avatar)
            }

            res.json({avatar:avatars[0]})
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadCover: async (req, res) => {
        try {
            const files = req.files; 
            if(files[0].mimetype !== 'image/jpeg' && files[0].mimetype !== 'image/png'){
                return res.status(400).json({msg: "File format is incorrect."})
            }
            const covers = []

            for(var i = 0; i<files.length;i++){
                const params = {
                    Bucket: `${process.env.AWS_PUBLIC_BUCKET_NAME}/cover`,
                    Key: `${uuidv4()}${files[i].originalname}`,
                    Body: `${uuidv4()}-${files[i].originalname}`,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                const cover = {
                    key: uploadResult.Key,
                    url: uploadResult.Location
                }

                covers.push(cover)
            }

            res.json({cover:covers[0]})
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = uploadCtrl