let mongoose = require("mongoose")
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId


let schema = new Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    coordinates: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    distance: {
        type: Number
    },

    votes: {}

})

module.exports = mongoose.model('Post', schema)