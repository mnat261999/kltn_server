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
                return res.status(400).json({success: false, msg: "File format is incorrect."})
            }
            const avatars = []

            for(var i = 0; i < files.length; i++){
                const params = {
                    Bucket: `${process.env.AWS_PUBLIC_BUCKET_NAME}/avatar`,
                    Key: `${uuidv4()}_${files[i].originalname}`,
                    Body: files[i].buffer,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                const avatar = {
                    key: uploadResult.Key,
                    url: uploadResult.Location
                }

                avatars.push(avatar)
            }

            res.status(200).json({ 
                success:true,
                data:avatars[0]
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadCover: async (req, res) => {
        try {
            const files = req.files; 
            if(files[0].mimetype !== 'image/jpeg' && files[0].mimetype !== 'image/png'){
                return res.status(400).json({success: false, msg: "File format is incorrect."})
            }
            const covers = []

            for(var i = 0; i<files.length;i++){
                const params = {
                    Bucket: `${process.env.AWS_PUBLIC_BUCKET_NAME}/cover`,
                    Key: `${uuidv4()}_${files[i].originalname}`,
                    Body: files[i].buffer,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                const cover = {
                    key: uploadResult.Key,
                    url: uploadResult.Location
                }

                covers.push(cover)
            }

            res.status(200).json({ 
                success:true,
                data:covers[0]
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    uploadMediaPost: async (req, res) => {
        try {
            const files = req.files; 

            if(files.some( f => f.mimetype != 'video/mp4' && f.mimetype != 'image/jpeg' && f.mimetype != 'image/png') ){
                return res.status(400).json({success: false, msg: "File format is incorrect."})
            }

            const medias = []

            for(var i = 0; i<files.length;i++){
                const params = {
                    Bucket: `${process.env.AWS_PUBLIC_BUCKET_NAME}/media`,
                    Key: `${uuidv4()}_${files[i].originalname}`,
                    Body: files[i].buffer,
                    ACL:'public-read-write'
                };

                const uploadResult = await s3.upload(params).promise();

                const media = {
                    media:{
                        key: uploadResult.Key,
                        url: uploadResult.Location
                    },
                    typeMedia: files[i].mimetype
                }

                medias.push(media)
            }

            res.status(200).json({ 
                success:true,
                data:medias
            })
        
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = uploadCtrl