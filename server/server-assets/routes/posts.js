let router = require('express').Router()
let Post = require('../models/post')

function haversine(lat1, lng1, lat2, lng2) {
  const earthRadius = 6371000
  let yourLat = lat1 * (Math.PI / 180)
  let targetLat = lat2 * (Math.PI / 180)
  let latDif = (lat2 - lat1) * (Math.PI / 180)
  let lngDif = (lng2 - lng1) * (Math.PI / 180)

  let a = (Math.sin(latDif / 2) * Math.sin(latDif / 2)) +
    (Math.cos(yourLat) * Math.cos(targetLat) *
      Math.sin(lngDif / 2) * Math.sin(lngDif / 2))

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return (earthRadius * c) / 1000
}

//get all posts (possibly change)
router.get('/:lat/:lng/:radius', (req, res, next) => {
  Post.find({})
    .then(posts => {
      let inRangePosts = posts.filter(post => {
        let distanceKm = haversine(req.params.lat, req.params.lng, post.coordinates.lat, post.coordinates.lng)
        let distanceMiles = distanceKm * .6213
        if (distanceMiles <= req.params.radius) {
          return post
        }
      })
      res.send(inRangePosts)
    })
    .catch(err => {
      console.log(err)
      next()
    })
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