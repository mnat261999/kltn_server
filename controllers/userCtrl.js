const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const algoliasearch = require('algoliasearch')
const { mongoose } = require("mongoose");



const { CLIENT_URL } = process.env

// Connect and authenticate with your Algolia app
const client = algoliasearch('KPC88LV7K0', 'bf9d249b2f37e1507a628474b318f57c')


const userCtrl = {
    register: async (req, res) => {
        try {

            const { fullname, username, email, password, dob, gender } = req.body

            if (!fullname || !username || !email || !password || !dob || !gender)
                return res.status(400).json({ success: false, msg: "Please fill in all fields." })

            if (!validateEmail(email))
                return res.status(400).json({ success: false, msg: "Invalid emails." })

            const user = await Users.findOne({ email })

            if (user) return res.status(400).json({ success: false, msg: "This email already exists." })

            if (!validatePass(password))
                return res.status(400).json({ success: false, msg: "Password must be at least 8 characters, one letter and one number." })

            const passwordHash = await bcrypt.hash(password, 12)

            const format_dob = Date(dob)

            const newUser = {
                fullname, username, email, password: passwordHash, dob: format_dob, gender
            }

            const activation_token = createActivationToken(newUser)

            const url = `${CLIENT_URL}/activate/${activation_token}`


            sendMail(email, url, "Verify your email address")

            res.status(200).json({
                success: true,
                msg: "Register Success! Please activate your email to start.",
                activation_token: activation_token
            })
        } catch (err) {
            return res.status(500).json({
                success: false,
                msg: err.message
            })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { fullname, username, email, password, dob, gender } = user
            const check = await Users.findOne({ email })
            if (check) return res.status(400).json({ success: false, msg: "This email already exists." })

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

            res.status(200).json({
                success: true,
                msg: "Account has been activated!"
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            if (!email || !password)
                return res.status(400).json({ success: false, msg: "Please fill in all fields." })
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ success: false, msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ success: false, msg: "Password is incorrect" })

            const refresh_token = createRefreshToken({ id: user._id })
            const access_token = createAccessToken({ id: user._id })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7 days
            })


            res.status(200).json({
                success: true,
                msg: "Login success!",
                data: {
                    access_token: access_token,
                    user: {
                        ...user._doc,
                        password: '',
                        blockedBy: []
                    }
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken

            //console.log(req.cookies)

            if (!rf_token) return res.status(400).json({ success: false, msg: 'Please login now!' })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
                if (err) { return res.status(400).json({ success: false, msg: 'Please login now!' }) }

                //console.log(user)
                const userInfor = await Users.findById(user.id).select('-blockedBy')
                const access_token = createAccessToken({ id: user.id })
                res.status(200).json({
                    success: true,
                    data: {
                        access_token: access_token,
                        user: userInfor
                    }
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    fogotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ success: false, msg: "This email does not exist." })

            const access_token = createAccessToken({ id: user._id })
            const url = `${CLIENT_URL}/user/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.status(200).json({
                success: true,
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
            res.status(200).json({
                success: true,
                msg: "Password successfully changed!"
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.status(200).json({
                success: true,
                msg: "Logged out."
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    blockUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const userBlock = await Users.findById(req.params.id)

            if (user.blockedUsers.some(id => id == req.params.id) == true) {
                return res.status(400).json({ success: false })
            } else if (userBlock.blockedUsers.some(id => id == req.user.id) == true) {
                return res.status(400).json({ success: false })
            } else {
                Users.findOneAndUpdate(
                    { "_id": req.user.id },
                    { $pull: { followings: req.params.id, followers: req.params.id }, $push: { blockedUsers: req.params.id } },
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

            console.log(user)

            Users.find({ "_id": { $in: user.blockedUsers } })
                .select('fullname username _id avatar')
                .exec((err, users) => {
                    console.log(err)
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({
                        success: true,
                        data: users
                    });
                })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    searchUser: async (req, res) => {
        try {
            let limit = req.query.limit ? parseInt(req.query.limit) : 5;
            let skip = req.query.skip ? parseInt(req.query.skip) : 0;

            const matchRegex = new RegExp(req.query.keyword);

            const user = await Users.findById(req.user.id)

            const blockedUsers = user.blockedUsers

            const blockedBy = user.blockedBy

            const blockList = blockedUsers.concat(blockedBy)

            const users = await Users.find(
                {
                    $or: [
                        { username: { $regex: matchRegex, $options: 'i' } },
                        { fullname: { $regex: matchRegex, $options: 'i' } }
                    ],
                    _id: { $nin: blockList },
                    role: { $ne: "admin" }
                }
            )
                .skip(skip)

                .limit(limit)

                .select("_id avatar fullname username")

            return res.status(200).json({
                success: true,
                data: users
            })
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
                $and: [
                    { _id: req.params.id },
                    { _id: { $nin: blockList } }
                ]
            })
                .select('-password -request -blockedBy')

            return res.status(200).json({
                success: true,
                data: userInfor
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getUserLogin: async (req, res) => {
        try {
            console.log(req.user.id)
            const user = await Users.findById(req.user.id).select('-blockedBy')

            return res.status(200).json({
                success: true,
                data: user
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateUser: async (req, res) => {
        try {
            const { fullname, username, email, gender, dob, address, website } = req.body
            if (!fullname )
                return res.status(400).json({ success: false, msg: "Please enter full name." })

            const format_dob = Date(dob)

            await Users.findOneAndUpdate({ _id: req.user.id }, {
                fullname, username, email, gender, dob: format_dob, address, website
            })

            return res.status(200).json({
                success: true,
                msg: "Update Success!"
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    askFollow: async (req, res) => {
        try {
            const ask = await Users.findByIdAndUpdate(req.params.id, {
                $addToSet: { request: req.user.id }
            }, {
                new: true
            }).populate("followers", "_id username avatar")
                .populate("following", "_id username avatar")

            return res.status(200).json({
                success: true,
                ask
            })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    cancelInviteFollow: async (req, res) => {
        try {

            await Users.findByIdAndUpdate(req.params.id, {
                $pull: { request: req.user.id }
            })

            return res.status(200).json({
                success: true
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    declineFollow: async (req, res) => {
        try {
            await Users.findByIdAndUpdate(req.user.id, {
                $pull: { request: req.params.id }
            })

            return res.status(200).json({
                success: true
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    acceptFollow: async (req, res) => {
        try {
            Users.findByIdAndUpdate(req.params.id, {
                $addToSet: { following: req.user.id }
            }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({ success: false })
                }
                console.log(result)
            })

            Users.findByIdAndUpdate(req.user.id, {
                $addToSet: { followers: req.params.id },
                $pull: { request: req.params.id }
            }).exec((err, result) => {
                if (err) {
                    return res.status(400).json({ success: false })
                }
                else {
                    console.log(result)
                    return res.status(200).json({
                        success: true
                    })
                }
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    suggestionUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)

            const num = req.query.num || 10

            const users = await Users.aggregate([
                {
                    "$match": {
                        "$and": [
                            {
                                "_id": {
                                    "$nin": [...user.following, mongoose.Types.ObjectId(req.user.id)]
                                }
                            },
                            {
                                "_id": {
                                    "$nin": user.blockedUsers
                                }
                            },
                            {
                                "_id": {
                                    "$nin": user.blockedBy
                                }
                            },
                            {
                                "role": {
                                    "$ne": "admin"
                                }
                            }
                        ]
                    }
                },
                {
                    "$sample": {
                        "size": Number(num)
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "followers",
                        "foreignField": "_id",
                        "as": "followers"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "following",
                        "foreignField": "_id",
                        "as": "following"
                    }
                }
            ]).project("-password -request -blockedBy -blockedUsers -role")

            return res.status(200).json({
                success: true,
                data: users
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getListFollowByUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.userId)

            if (req.params.action == 'follower') {
                Users.find({ "_id": { $in: user.followers } })
                    .select('fullname username _id avatar')
                    .exec((err, users) => {
                        console.log(err)
                        if (err) return res.status(400).send(err);
                        return res.status(200).json({
                            success: true,
                            data: users
                        });
                    })
            } else if(req.params.action == 'following'){
                Users.find({ "_id": { $in: user.following } })
                .select('fullname username _id avatar')
                .exec((err, users) => {
                    console.log(err)
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({
                        success: true,
                        data: users
                    });
                })
            }else {
                return res.status(500).json();
            }
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }
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
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '10m' })
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
module.exports = userCtrl