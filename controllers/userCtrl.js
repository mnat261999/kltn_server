const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const algoliasearch = require('algoliasearch')


const { CLIENT_URL } = process.env

// Connect and authenticate with your Algolia app
const client = algoliasearch('KPC88LV7K0', 'bf9d249b2f37e1507a628474b318f57c')


const userCtrl = {
    register: async (req, res) => {
        try {

            const { fullname, username, email, password, dob, gender } = req.body

            if (!fullname || !username || !email || !password || !dob || !gender)
                return res.status(400).json({ msg: "Please fill in all fields." })

            if (!validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })

            const user = await Users.findOne({ email })

            if (user) return res.status(400).json({ msg: "This email already exists." })

            if (!validatePass(password))
                return res.status(400).json({ msg: "Password must be at least 8 characters, one letter and one number." })

            const passwordHash = await bcrypt.hash(password, 12)

            const format_dob = Date(dob)

            const newUser = {
                fullname, username, email, password: passwordHash, dob: format_dob, gender
            }

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/user/activate/${activation_token}`


            sendMail(email, url, "Verify your email address")

            res.json({
                msg: "Register Success! Please activate your email to start.",
                activation_token: activation_token
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { fullname, username, email, password, dob, gender } = user
            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ msg: "This email already exists." })

            const format_dob = Date(dob)

            const newUser = new Users({
                fullname, username, email, password, dob: format_dob, gender
            })

            const userNew = await newUser.save()

            const index = client.initIndex('User')

            index.saveObject({
                fullname: userNew.fullname,
                username: userNew.username,
                email: userNew.email,
                dob: userNew.dob,
                gender: userNew.gender,
                objectID: userNew._id.toHexString()
            })

            //console.log(userNew._id.toHexString())

            res.json({ msg: "Account has been activated!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect" })

            const refresh_token = createRefreshToken({ id: user._id })
            const access_token = createAccessToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
            })

            //console.log(user)
            res.json({
                msg: "Login success!",
                access_token: access_token
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken

            //console.log(req.cookies)

            if (!rf_token) return res.status(400).json({ msg: 'Please login now!' })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) { return res.status(400).json({ msg: 'Please login now!' }) }

                //console.log(user)
                const access_token = createAccessToken({ id: user.id })
                res.json({ access_token })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    fogotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({
                msg: "Re-send the password, please check your email.",
                access_token: access_token
            })

        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            //console.log("Test: "+ password)
            const passwordHash = await bcrypt.hash(password, 12)

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                password: passwordHash
            })

            //console.log("Hash: " + password)
            res.json({ msg: "Password successfully changed!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    blockUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const userBlock = await Users.findById(req.params.id)

            if (user.blockedUsers.some(id => id == req.params.id) == true) {
                return res.status(400).json({ success: false})
            } else if(userBlock.blockedUsers.some(id => id == req.user.id) == true) {
                return res.status(400).json({ success: false})
            } else {
                Users.findOneAndUpdate(
                    { "_id": req.user.id },
                    { $pull: { followings: req.params.id, followers: req.params.id }, $push: { blockedUsers: req.params.id }},
                    { new: true },
                    (err, user) => {
                        if (err) return res.status(400).json({ success: false });
                        Users.findOneAndUpdate(
                            { "_id": req.params.id },
                            { $pull: { followers: req.user.id, followings: req.user.id }, $push: { blockedBy: req.user.id } },
                            { new: true }, (err, results) => {
                                if (err) return res.status(400).json({ success: false });
                                return res.status(200).json({ success: true, userId: req.params.id })
                            })
                })
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    unblockUser: async (req, res) => {
        try {
            Users.findOneAndUpdate(
                { "_id": req.user.id },
                { $pull: { blockedUsers: req.params.id } },
                { new: true },
                (err, user) => {
                    if (err) return res.status(400).json({ success: false });
                    Users.findOneAndUpdate(
                        { "_id": req.params.id },
                        { $pull: { blockedBy: req.user.id } },
                        { new: true }, (err, results) => {
                            if (err) return res.status(400).json({ success: false });
                            return res.status(200).json({ success: true, userId: req.params.id })
                        })
                })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getListBlockByUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            Users.find({ "_id": { $in: user.blockedUsers } })
                .select('username _id avatar')
                .exec((err, users) => {
                    console.log(err)
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({users});
                })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    searchUser: async (req, res) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 3;
            let skip = req.query.skip ? parseInt(req.query.skip) : 0;

            const matchRegex = new RegExp(req.query.keyword);

            const user = await Users.findById(req.user.id)

            const blockedUsers = user.blockedUsers

            const blockedBy = user.blockedBy

            const blockList = blockedUsers.concat(blockedBy)

            const users = await Users.find(
                { $or:[
                    {username:{$regex:  matchRegex, $options: 'i' }},
                    {fullname:{$regex:  matchRegex, $options: 'i' }}
                ],
                _id: { $nin: blockList } }
                )
                .skip(skip)
                                    
                .limit(limit)
                                    
                .select("_id avatar fullname username")

            return res.status(200).json({ users })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const blockedUsers = user.blockedUsers

            const blockedBy = user.blockedBy

            const blockList = blockedUsers.concat(blockedBy)

            const userInfor = await Users.find({
                $and:[
                    {_id: req.params.id},
                    {_id: {$nin: blockList}}
                ]
            })
            .select('-password -request -blockedBy')
                                         
            return res.status(200).json({ userInfor })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserLogin: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id).select('-blockedBy')
                                         
            return res.status(200).json({ user })
            
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async(req, res) => {
        try {
            const {avatar, fullname, mobile, address, story, website, gender} = req.body
            if(!fullname) 
                return res.status(500).json({ msg: err.message })
            await Users.findOneAndUpdate({_id: req.user._id}, {
                avatar, fullname, mobile, address, story, website, gender   
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }, 
    follow: async(req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id}) 
            if(user.length > 0) 
                return res.status(500).json({ msg: "You followed this user." })
            
            await Users.findByIdAndUpdate({_id: req.params.id}, {
                $push: {followers: req.user._id} 
            }, {new: true})

            await Users.findByIdAndUpdate({_id: req.params.id}, {
                $push: {followings: req.user._id} 
            }, {new: true})
            
            res.json({msg: 'Followed User.'})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }, 
    unfollow: async(req, res) => {
        try {
            const user = await Users.find({_id: req.params.id, followers: req.user._id}) 
            if(user.length > 0) 
                return res.status(500).json({ msg: "You followed this user." })
            
            await Users.findByIdAndUpdate({_id: req.params.id}, {
                $push: {followers: req.user._id} 
            }, {new: true})

            await Users.findByIdAndUpdate({_id: req.params.id}, {
                $push: {followings: req.user._id} 
            }, {new: true})
            
            res.json({msg: 'Unfollow User.'})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }, 
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePass(pass) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(pass);
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '1m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl