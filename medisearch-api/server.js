const express = require("express");
const logging = require("express-logging");
const logger = require("logops");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const urlencoder = bodyParser.urlencoded({
    extended: false
})
const session = require("express-session");
const path = require("path");
const cors = require("cors");
var app = new express();

require('dotenv').config();
require('./start/models/database');

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

logger.format = logger.formatters.dev;
app.use(logging(logger));
app.use(cookieParser());
app.use(urlencoder);
app.use(express.static(path.join(__dirname, 'build')));
app.use(function (req, res, next) {
    res.set("Cache-Control", "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0");
    next();
})
app.use(session({
    resave: false,
    name: "medisearch",
    saveUninitialized: true,
    secret: "secretpass"
}))
app.use(require("./start"));
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.PORT || 8000, function () {
    console.log("Server is running at port 8000...");
})