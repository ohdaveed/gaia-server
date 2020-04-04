const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
    },
    url: String,
    plant_name: Array,
    location: Array,
    user: String,
    mimetype: String,
    tags: Array,  
    css: String,
    user: String,
    date_created: { type: Date, default: Date.now },
});

const Photo = mongoose.model('Photos', photoSchema);

module.exports = Photo;
