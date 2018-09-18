let router = require('express').Router();
let Users = require('../models/User');
let session = require('./session')

//NEVER TELL USERS WHICH FAILED
let loginError = new Error('Bad Email or Password')

//CHECK FOR USERNAME ALREADY IN USE
router.get('/auth/exists/:name', (req, res, next) => {
  Users.findOne({ username: req.params.name }, 'username')
    //cant send user.length because throws an error and prohibits new users from successfully registering
    //may need to look into .findOne ...
    .then(username => res.send(username))
    .catch(err => {
      console.log(err)
      next()
    })
})

//CREATE A NEW USER
router.post('/auth/register', (req, res, next) => {
  //VALIDATE PASSWORD LENGTH
  if (req.body.password.length < 5) {
    return res.status(400).send({
      error: 'Password must be at least 6 characters'
    })
  }
  //CHANGE THE PASSWORD TO A HASHED PASSWORD
  req.body.password = Users.generateHash(req.body.password)
  //CREATE THE USER
  Users.create(req.body)
    .then(user => {
      //REMOVE THE PASSWORD BEFORE RETURNING
      delete user._doc.password
      //SET THE SESSION UID (SHORT FOR USERID)
      req.session.uid = user._id
      res.send(user)
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

//LOGIN AN EXISTING USER
router.post('/auth/login', (req, res) => {
  //FIND A USER BASED ON UNIQUE USERNAME
  Users.findOne({
    username: req.body.username
  })
    .then(user => {
      if (!user) {
        return res.status(400).send(loginError)
      }
      //CHECK THE PASSWORD
      if (!user.validatePassword(req.body.password)) {
        return res.status(400).send(loginError)
      }
      //ALWAYS REMOVE THE PASSWORD FROM THE USER OBJECT
      delete user._doc.password
      req.session.uid = user._id
      res.send(user)
    }).catch(err => {
      res.status(400).send(loginError)
    })
})

//REMOVE THE ACTIVE SESSION FROM THE DATABASE
router.delete('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.send(err)
    }
    return res.send({
      message: 'Logout Successful'
    })
  })
}),

  //DELETE A USER ACCOUNT
  router.delete('/auth/delete', (req, res, next) => {
    Users.findByIdAndRemove(req.session.uid, function (err) { })
      .then(() => res.send({ message: 'User Account Deleted' }))
      .catch(next)
  })


//Validates req.session.uid
router.get('/auth/authenticate', (req, res) => {
  Users.findById(req.session.uid)
    .then(user => {
      if (!user) {
        return res.status(401).send({
          error: 'Please login to continue'
        })
      }
      delete user._doc.password
      res.send(user)
    }).catch(err => {
      res.status(500).send(err)
    })
})

//Retrieve other user info to view their profile
router.get('/auth/find/byUserId/:userId', (req, res, next) => {
  Users.findById(req.params.userId)
    .then(user => {
      let obj = {
        userId: user._id,
        username: user.username,
        troll: user.troll,
        created: user.created,
        reliability: user.reliability,
        email: user.email
      }
      res.send(obj)
    })
    .catch(err => {
      console.log(err)
      next()
    })
}),

  //Add a userId to the blockedUsers dictionary
  router.post('/auth/block', (req, res, next) => {
    Users.findById(req.session.uid)
      .then(user => {
        if (!user.blockedUsers) { user.blockedUsers = {} }
        user.blockedUsers[req.body.userId] = req.body.userId
        user.markModified('blockedUsers')
        user.save((err) => {
          if (err) {
            return res.status(500).send(err)
          }
          delete user._doc.password
          return res.send(user)
        })
      })
  })

router.post('/auth/reliabilty', (req, res, next) => {
  Users.findById(req.session.uid)
    .then(user => {
      if (!user.reliability) { user.reliability = {} }
      user.reliability[req.session.uid] = req.body
      user.markModified('reliability')
      user.save((err) => {
        if (err) {
          console.log(err)
          return res.status(401).send(err)
        }
        return res.send(user)
      })
    })
    .catch(err => {
      console.log(err)
      next()
    })
})

module.exports = {
  router,
  session
}