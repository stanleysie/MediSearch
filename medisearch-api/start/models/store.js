const mongoose = require('mongoose');
const to = require('../../utils/to');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const { Schema } = mongoose;
const extract = ['_id', 'name', 'username', 'email', 'description', 'address', 'branch', 'image', 'birPermit', 'openingHours', 'location', 'contact', 'products'];

const storeSchema = new Schema({
    name: String,
    username: String,
    email: String,
    address: String,
    branch: String,
    description: String,
    image: ObjectID,
    birPermit: ObjectID,
    openingHours: [],
    location: {
        lat: Number,
        lng: Number,
        url: String
    },
    contact: [],
    products: [],
    password: String,
    salt: String
})

storeSchema.statics.authenticate = (username, password, callback) => {
    Store.findOne({ username }).then((doc) => {
        if(doc) {
            bcrypt.compare(password, doc.password, (err, same) => {
                if(same) {
                    doc = _.pick(doc, extract);
                    callback({ valid: true, store: doc, message: 'Successfully login!' });
                } else {
                    callback({ valid: false, store: {}, message: 'Invalid credentials!' });
                }
            })
        } else {
            callback({ valid: false, store: {}, message: 'Account does not exist!' });
        }
    })
}

storeSchema.statics.create = (store, callback) => {
    Store.findOne({ username: store.username }).then((doc) => {
        if(doc) {
            return to({ valid: false, store: {}, message: 'Username already exists!' });
        } else {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(store.password, salt, (error, hash) => {
                    store.password = hash;
                    store.salt = salt;
                    store.save().then((result, err) => {
                        if(err) {
                            callback({ valid: false, store: {}, message: 'Failed to create a store account!' });
                        } else {
                            result = _.pick(result, extract);
                            callback({ valid: true, store: result, message: 'Successfully create a store account!' })
                        }
                    })
                })
            })
        }
    })
}

storeSchema.statics.update = (storeID, store, callback) => {
    Store.findOneAndUpdate({
        _id: storeID
    }, {
        name: store.name,
        username: store.username,
        email: store.email,
        description: store.description,
        address: store.address,
        branch: store.branch,
        image: store.image,
        birPermit: store.birPermit,
        openingHours: store.openingHours,
        location: store.location,
        contact: store.contact,
        products: store.products,
    }).then(() => {
        Store.findOne({ _id: storeID }).then((doc) => {
            callback(doc);
        })
    })
}

storeSchema.statics.updatePassword = (storeID, password, salt, callback) => {
    Store.findOneAndUpdate({
        _id: storeID
    }, {
        password,
        salt
    }).then((doc) => {
        callback(doc);
    })
}

storeSchema.statics.delete = (storeID) => {
    return to(
        Store.findOneAndDelete({ _id: storeID })
    );
}

storeSchema.statics.findByUsername = (username, callback) => {
    Store.findOne({ username }).then((doc) => {
        callback(doc);
    })
}

storeSchema.statics.findByID = (storeID, callback) => {
    Store.findById({ _id: storeID }).then((doc) => {
        callback(doc);
    })
}

const Store = mongoose.model('Store', storeSchema, 'stores');

module.exports = Store;