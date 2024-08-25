const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
    },
    public_id: String,
    photo_url: String,
    plant_name: Array,
    latdec: Number,
    longdec: Number,
    delete_token: String,
    date: Date,
    user: String,
    tags: {
            type: mongoose.Schema.Types.ObjectID,
        ref: 'User',
    },
    user: String,
    signature: String,
    date_created: { type: Date}
});

const Photo = mongoose.model('Photos', photoSchema);

module.exports = Photo;
