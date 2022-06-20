require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const SocketServer = require('./socketServer')
const bcrypt = require('bcrypt')
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const Users = require('./models/userModel')

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());


//Socket
const http = require('http').createServer(app)
const io = require('socket.io')(http)

io.on('connection', socket => {
	SocketServer(socket)
})

/* const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Hello World',
			version: '1.0.0',
		},
		servers: [
			{
				url: "http://localhost:2000/api",
			}
		],
		securityDefinitions: {
			api_key: {
				type: 'apiKey',
				name: 'Authorization',
				in: 'header',
				description: 'Requests should pass an api_key header'
			}
		}
	},
	apis: ["swaggerDocApi.js"], // files containing annotations as above
}; */

const swaggerSpec = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'Express-JWT',
			version: '1.0.0',
		},
		servers: [
			{
				url: "http://localhost:2000/api",
			}
		],
		components: {
			securitySchemes: {
				Auth: {
					type: 'apiKey',
					name: 'Authorization',
					in: 'header',
					description: 'Requests should pass an api_key header'
				},
			},
		},
	},
	apis: ['swaggerDocApi.js'],
};


const specs = swaggerJsDoc(swaggerSpec);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));


// Routes
app.use("/api/user", require("./routes/userRouter"));
app.use("/api/upload", require("./routes/uploadRouter"));
app.use("/api/avatar", require("./routes/avatarRouter"));
app.use("/api/cover", require("./routes/coverRouter"));
app.use("/api/post", require("./routes/postRouter"));
app.use("/api/comment", require("./routes/commentRouter"));
app.use("/api/policy", require("./routes/policyRouter"));
app.use("/api/report", require("./routes/reportRouter"));




const URI = process.env.MONGODB_URL;

mongoose.connect(
	URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	},
	async (err) => {
		if (err) throw err;
		console.log("Connected to mongodb");

		const users = await Users.find()

		const checkAdmin = users.some(u => u.role == 'admin')

		if (checkAdmin == false) {
			const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)
			const newAdmin = new Users({
				fullname: process.env.ADMIN_NAME, username: process.env.ADMIN_USERNAME,
				email: process.env.ADMIN_EMAIL,
				password: passwordHash,
				dob: Date.now(),
				gender: process.env.ADMIN_GENDER,
				role: 'admin'
			})

			await newAdmin.save()

			console.log("Admin create");
		} else { console.log("Admin exists"); }
	}
);

const port = process.env.PORT || 2000;
http.listen(port, () => {
	console.log("Server is running on port", port);
});
