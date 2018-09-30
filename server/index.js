let express = require("express")
let bp = require('body-parser')
let app = express()
let cors = require('cors')
let port = process.env.PORT || 3000
app.use(express.static(__dirname + '/../client/dist'))

var server = require("http").createServer(app);
var io = require("socket.io")(server);

let whitelist = ['http://localhost:8080', 'https://bullutin.herokuapp.com/']
let corsOptions = {
    origin: function (origin, callback) {
        let originIsWhitelisted = whitelist.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
    },
    credentials: true
}
app.use(cors(corsOptions))

require('./server-assets/db/db-config')

app.use(bp.json())
app.use(bp.urlencoded({
    extended: true
}))


let connectedUsers = {}
// @ts-ignore
let rooms = {}

io.on("connection", socket => {
    console.log("User Connected")

    //notify connector of successfull connection
    socket.emit("CONNECTED", {
        socket: socket.id,
        message: "Successfully Connected"
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
        console.log('backend data variable is' + data)
        if (data) {
            console.log("post recieved")
            io.to('bullutin').emit('newPost', data)
        }
    })
})


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

server.listen(port, () => {
    console.log("Server listening at port:", port);
})

