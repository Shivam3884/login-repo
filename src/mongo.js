const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/logindata')
.then(() => {
    console.log('Connection successful');
})
.catch((e) => {
    console.error('No connection:', e);
});

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
});

const collection = new mongoose.model('logindatacollection', schema);

module.exports = collection;