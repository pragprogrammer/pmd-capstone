let express = require("express")
let bp = require('body-parser')
// let server = express()
let app = express()
let cors = require('cors')
let port = process.env.PORT || 3000
require('./server-assets/db/db-config')

//need to npm i socket.io!!!

app.use(express.static(__dirname + '/../../client/dist'))

app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))

let whitelist = ['http://localhost:8080', 'https://bullutin.herokuapp.com/']
let corsOptions = {
    origin: function (origin, callback) {
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
    },
    credentials: true
}
app.use(cors(corsOptions))

var server = require("http").createServer(app);
var io = require("socket.io")(server);


server.listen(port, function () {
    console.log("Server listening at port:", port);
})

let connectedUsers = {} // (probably going to be referencing our users id's)
// @ts-ignore
let rooms = {} // (not going to be rooms, but referencing the radius of viewable posts?)

io.on("connection", socket => {
    console.log("User Connected")       // (tells server when a user connects)

    //notify connector of successfull connection
    socket.emit("CONNECTED", {                //    (notifys connector of successful connection)
        socket: socket.id,                     //  (socket is a connection by individual user)
        message: "Successfully Connected"        //    (client emits to server, server emits to app. direct communication.)
    })

    //join room
    socket.on("join", data => {
        //insures connection passed the (user.name?)
        if (data.name) {
            //this attatches the name to socket
            // @ts-ignore
            socket.user = data.name;

            //adds connection to the room
            socket.join("bullutin")

            //adds user to connecteUsers
            connectedUsers[data.name] = data.name;

            //notifys connection of the rooms connection
            socket.emit("joinedRoom", {
                roomName: "bullutin",
                connectedUsers: connectedUsers
            })

            //norify room of new connection
            io.to("bullutin").emit("newUser", { userName: data.name })
        }
    })

    //connection leaves room
    // @ts-ignore
    socket.on('leave', data => {
        //confirm they were in a room
        // @ts-ignore
        if (socket.user) {
            //remove from connected room
            // @ts-ignore
            delete connectedUsers[socket.user]
            // @ts-ignore
            io.to("bullutin").emit('left', socket.user)
        }
    })

    socket.on('disconnect', data => {
        //confirm they were in a room
        // @ts-ignore
        if (socket.user) {
            //remove from connected room
            // @ts-ignore
            delete connectedUsers[socket.user]
            // @ts-ignore
            io.to("bullutin").emit('left', socket.user)
        }
    })

    socket.on('post', data => {
        console.log('post recieved')
        io.to('bullutin').emit('newPost', data)
    })
})
// joins viewable radius of other users?
// socket.on("join", data => {

// })

//USER AUTH

let auth = require('./server-assets/auth/routes')
app.use(auth.session)
app.use(auth.router)

//GATEKEEPER
app.use((req, res, next) => {
    if (!req.session.uid) {
        return res.status(401).send({
            error: 'please login to continue'
        })
    }
    next()
})


//other routes here
let postRoutes = require('./server-assets/routes/posts')
app.use('/api/posts', postRoutes)

// @ts-ignore
app.get('*', (req, res, next) => {
    res.status(404).send({
        error: 'this is not the page you are looking for'
    })
})

// app.listen(port, () => {
//     console.log('connected to port: ', port)
// })
