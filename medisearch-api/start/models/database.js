const mongoose = require("mongoose");
const MONGODB_URI = 'mongodb+srv://admin:admin@medisearch.up9n2.mongodb.net/MediSearch?retryWrites=true&w=majority';

let connnection = mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).catch(err => console.log(err))

module.exports = connnection;