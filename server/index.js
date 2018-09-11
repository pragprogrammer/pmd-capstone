let express = require("express")
let bp = require('body-parser')
let server = express()
let cors = require(cors())
let port = 3000
require('./server-assets/db/db-config')

server.use(bp.json())
server.use(bp.urlencoded({
    extended: true
}))

let whitelist = ['http://localhost:8080']
let corsOptions = {
    origin: function (origin, callback){
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
    },
    credentials: true
}
server.use(cors(corsOptions))

//DON, auth here
// can use below or replace with whatever you need to link up
let auth = require('./server-assets/auth/routes')
server.use(auth.session)
server.use(auth.router)
//auth stop

//gatekeeper route here
//
//

//other routes here
//
//

server.get('*', (req, res, next) => {
    res.status(404).send({
        error: 'this is not the page you are looking for'
    })
})

server.listen(port, () => {
    console.log('connected to db')
})
