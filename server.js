require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')


const app = express()
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use('/api/user', require('./routes/userRouter'))
app.use('/api/upload', require('./routes/uploadRouter'))



// Routes


const URI = process.env.MONGODB_URL

mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err
    console.log('Connected to mongodb')
})


const port = process.env.PORT || 2000
app.listen(port, () => {
    console.log('Server is running on port', port)
})