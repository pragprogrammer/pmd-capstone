let mongoose = require("mongoose")
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let voteSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    value: {
        type: Number,
        min: -1,
        max: 1,
        required: true
    }
})

let schema = new Schema({
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