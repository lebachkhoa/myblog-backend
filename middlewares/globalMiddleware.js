const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const compression = require("compression");
const morgan = require("morgan");

const rateLimit = require("express-rate-limit")

const sanitizeMiddleware = require("./sanitizeMiddleware.js")

const globalMiddleware = [
    helmet(),
    cors({
        origin: process.env.CORS_HOST,
        credentials: true
    }),
    sanitizeMiddleware,
    hpp(),
    express.urlencoded({ extended: true }),
    express.json(),
    cookieParser(),
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: "Too many requests, please try again later."
    }),
    compression(),
    morgan("dev")
];

module.exports = globalMiddleware;
