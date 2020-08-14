const express = require("express");
const router = express.Router();
const response = require('../utils/response');

router.use("/api", require("./api"));

router.get('/', async (req, res) => {
    res.send(response(true, {}, 'API is running.'));
})

module.exports = router;