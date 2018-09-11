let mongoose = require('mongoose')
const connectionString = 'mongodb://student:student1@ds028559.mlab.com:28559/pmd-capstone'
let connection = mongoose.connection

mongoose.connect(connectionString, {
  useNewUrlParser: true
})

connection.on('error', err => {
  console.log("DATABASE ERROR: ", err)
})

connection.once('open', () => {
  console.log("CONNECTED TO DATABASE")
})