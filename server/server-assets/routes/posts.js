let router = require('express').Router()
let Post = require('../models/post')

//get all posts
router.get('/', (req, res, next) => {
  Post.find({})
    .then(posts => {
      return res.send(posts)
    })
    .catch(next)
})

//get specific posts
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      return res.send(post)
    })
    .catch(next)
})

//put
//post
//delete
router.delete('/:id', (req, res, send) => {
  Post.findByIdAndRemove(req.params.id)
    .then(() => res.send({
      message: 'Deleted'
    }))
})

//put specific vote
//post specific vote

module.exports = router