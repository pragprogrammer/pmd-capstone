let mongoose = require('mongoose')
let Schema = mongoose.Schema
let schemaName = 'User'

//bcrypt uses hashing and salt to obfiscate your password 
let bcrypt = require('bcryptjs')
const SALT = 10

let schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  troll: { type: Boolean, default: false },
  created: { type: Number, required: true },
  reliability: { type: Number, min: 0, max: 100, default: 50 },
  posts: {},
  blockedUsers: {}
})

//statics are used to create Model methods
schema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, SALT)
}

//schema.methods are used to add a method to a Model instance
schema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model(schemaName, schema)