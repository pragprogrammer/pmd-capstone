let router = require('express').Router()
let Post = require('../models/post')

//get all posts (possibly change)
router.get('/', (req, res, next) => {
  Post.find({})
    .then(posts => {
      return res.send(posts)
    })
    .catch(next)
})

//get specific posts(users posts?)
router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      return res.send(post)
    })
    .catch(next)
})

//edit a post
router.put('/:id', (req, res, next) => {
  Post.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.send({
      message: 'Edited'
    }))
})

//create a post
router.post('/', (req, res, next) => {
  Post.create(req.body)
    .then(post => {
      res.send(post)
    })
    .catch(next)
})

//delete
router.delete('/:id', (req, res, next) => {
  Post.findByIdAndRemove(req.params.id)
    .then(() => res.send({
      message: 'Deleted'
    }))
})

//put specific vote?????

//post specific vote
router.post('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      post.votes.push(req.body)
      post.save(post)
      res.send(post)
    })
    .catch(next)
})

module.exports = router