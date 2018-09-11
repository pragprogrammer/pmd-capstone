let mongoose = require("mongoose")
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let schema = new Schema({
    category: {
        type: String,
        required: true
    },
    timestamp: {
        
    }
})