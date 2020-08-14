const express = require('express');
const router = express.Router();
const response = require('../../utils/response');
const _ = require('lodash');

const Store = require('../models/store');
const extract = ['_id', 'name', 'username', 'email', 'description', 'address', 'branch', 'image', 'birPermit', 'openingHours', 'location', 'contact', 'products'];

router.use("/auth", require("./auth"));
router.use("/store", require("./store"));

router.get("/", async (req, res) => {
    let status = false;
    let message = 'No user found.'
    if(req.session.username !== undefined) {
        await Store.findByUsername(req.session.username, ((result) => {
            if(result) {
                status = true;
                message = 'User found.'
                result = _.pick(result, extract);
                res.send(response(status, result, message));
            } else {
                res.send(response(status, {}, message));
            }
        }))
    } else if(req.cookies.username !== undefined) {
        await Store.findByUsername(req.cookies.username, (result) => {
            if(result) {
                status = true;
                message = 'User found.'
                req.session.username = req.cookies.username;
                res.send(response(status, result, message));
            } else {
                res.send(response(status, {}, message));
            }
        });
    }
})

router.get('/ping', async (req, res) => {
    res.send(response(true, {}, 'Connection success!'));
})

module.exports = router;