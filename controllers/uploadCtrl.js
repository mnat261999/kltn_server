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
            const urls = []

            for(var i = 0; i<files.length;i++){
                const params = {
                    Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
                    Key: `${uuidv4()}${files[i].originalname}`,
                    Body: `${uuidv4()}-${files[i].originalname}`,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                urls.push(uploadResult.Location)
            }

            res.json({url:urls[0]})
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = uploadCtrl