const express = require("express");
const winston = require("winston");
const multer = require("multer");
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "uploads/");
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
	},
});
const upload = multer({ storage });
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// << Winston
const levels = {
	error: 0, // I am So Important 💪🏻
	warn: 1,
	info: 2,
	http: 3,
	verbose: 4,
	debug: 5,
	silly: 6, // I am weak 🙁
};

const logger = winston.createLogger({
	level: "info", // Level of info allowed (level >= info, ex: warn, err, info)
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: "app.log" }),
	],
});

// >> Winston

app.get("/", (req, res) => {
	logger.error("Something went wrong");
	res.send("Hello");
});

app.get("/posts", (req, res) => res.render("upload"));

// Multer
app.post("/posts", upload.single("fileName"), (req, res) => {
	console.log(req.file);
	res.send("File receieved");
});

app.listen(3001);
