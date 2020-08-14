const express = require('express');
const router = express.Router();
const response = require('../../../utils/response');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const multer = require('multer');

const upload = multer();
const extract = ['_id', 'name', 'username', 'email', 'description', 'address', 'branch', 'image', 'birPermit', 'openingHours', 'location', 'contact', 'products'];
const Store = require('../../models/store');

router.get('/get-all', async (req, res) => {
    Store.find({}).then((doc) => {
        res.send(response(true, doc, 'Successfully retrieve stores!'));
    })
})

router.post('/create', async (req, res) => {
    Store.create(new Store({
        name: '',
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        description: '',
        address: '',
        branch: '',
        image: null,
        birPermit: null,
        openingHours: ['', ''],
        location: { lat: 0, lng: 0, url: ''},
        contact: [],
        prodcuts: [],
        salt: ''
    }), (result) => {
        req.session.username = result.store.username;
        res.cookie('username', result.store.username, { maxAge: 1000*3600*24*365 });
        res.send(response(result.valid, result.store, result.message));
    })
})

router.post('/update', upload.none(), async (req, res) => {
    let newStore = JSON.parse(req.body.store);
    
    await Store.update(newStore._id, newStore, (result) => {
        result = _.pick(result, extract);
        res.send(response(true, result, 'Successfully update a store account!'));
    });
})

router.post('/update-password', async (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, async (error, hash) => {
            await Store.updatePassword(req.body.storeID, hash, salt, (result) => {
                result = _.pick(result, extract);
                res.send(response(true, result, 'Successfully update a store account!'));
            });
        })
    })
})

router.post('/delete', async (req, res) => {
    await Store.delete(req.body.storeID);
    res.send(response(true, {}, 'Successfully delete a store account!'));
})

module.exports = router;