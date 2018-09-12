let express = require("express")
let bp = require('body-parser')
let server = express()
//let app = express()
let cors = require('cors')
let port = 3000
require('./server-assets/db/db-config')

//need to npm i socket.io!!!

//var server = require("http").createServer(app);
//var io = require("socket.io")(server);

// server.listen(port, function() {
//     console.log("Server listening at port:" port);
// })

//let connectedUsers = {} (probably going to be referencing our users id's)
//let rooms = {} (not going to be rooms, but referencing the radius of viewable posts?)

// io.on("connection", socket => {
//     console.log("User Connected")        (tells server when a user connects)


// socket.emit("CONNECTED", {                    (notifys connector of successful connection)
//     socket: socket.id,                       (socket is a connection by individual user)
//     message: "Successfully Connected"            (client emits to server, server emits to server. direct communication.)
// })

//joins viewable radius of other users?
socket.on("join", data => {

})


server.use(bp.json())
server.use(bp.urlencoded({
    extended: true
}))

let whitelist = ['http://localhost:8080']
let corsOptions = {
    origin: function (origin, callback) {
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
    },
    credentials: true
}
server.use(cors(corsOptions))

//USER AUTH

let auth = require('./server-assets/auth/routes')
server.use(auth.session)
server.use(auth.router)

//GATEKEEPER
server.use((req, res, next) => {
    if (!req.session.uid) {
        return res.status(401).send({
            error: 'please login to continue'
        })
    }
    next()
})


//other routes here
//
//

server.get('*', (req, res, next) => {
    res.status(404).send({
        error: 'this is not the page you are looking for'
    })
})

server.listen(port, () => {
    console.log('connected to port: ', port)
})
