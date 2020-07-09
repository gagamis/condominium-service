const express = require("express");
var bodyParser = require('body-parser')
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/db");
const cors = require("cors");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const slowDown = require("express-slow-down");
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

dotenv.config({ path: "./config/config.env" }); // Load env vars

connectDB(); // Connect to database

// route files
const condominiumRoutes = require("./route/condominium");

const app = express();
app.use(bodyParser.json()); // body parser

// dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use(cors()); // Enable CORS

app.use(mongoSanitize()); // sanitize data

app.use(helmet()); // set security header

app.use(xss()); // prevet XSS attacks

const speedLimiter = slowDown({
    windowMs: 5 * 60 * 1000, // 5 minutes
    delayAfter: 100, // allow 100 requests per 5 minutes, then...
    delayMs: 100, // begin adding 500ms of delay per request above 100:
    // request # 101 is delayed by  500ms
    // request # 102 is delayed by 1000ms
    // request # 103 is delayed by 1500ms
    // etc.
    maxDelayMs: 10000,
});

app.use(speedLimiter); //  apply to all requests

// rate limiting
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 mins
    max: 100, 
    statusCode: 429,
    message: "Too many request created from this IP, please try again later"
});

app.use(hpp()); // prevent http param polution

// mount routers
app.use("/", condominiumRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});