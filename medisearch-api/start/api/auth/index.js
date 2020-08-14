const express = require('express');
const router = express.Router();
const response = require('../../../utils/response');

const Store = require('../../models/store');

router.post('/login', async (req, res) => {
    Store.authenticate(req.body.username, req.body.password, (result) => {
        req.session.username = result.store.username;
        res.cookie('username', result.store.username, { maxAge: 1000*3600*24*365 });
        res.send(response(result.valid, result.store, result.message));
    })
})

router.post('/logout', async (req, res) => {
    req.session.username = undefined;
    res.clearCookie('username');
    res.send(response(true, {}, 'Successfully logout!'));
})

module.exports = router;