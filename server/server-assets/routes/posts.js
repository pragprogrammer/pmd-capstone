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

//get all posts within given radius of user coords
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

//get all posts for specific posts
router.get('/:userId', (req, res, next) => {
  Post.find({ userId: req.params.userId })
    .then(posts => {
      return res.send(posts)
    })
    .catch(next)
})

//edit a post
router.put('/:postId', (req, res, next) => {
  Post.findByIdAndUpdate(req.params.postId, req.body)
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
router.delete('/:postId', (req, res, next) => {
  Post.findByIdAndRemove(req.params.postId)
    .then(() => res.send({
      message: 'Deleted'
    }))
})

//put specific vote?????

// vote on specific post
// router.post('/:postId/vote', (req, res, next) => {
//   Post.findById(req.params.postId)
//     .then(post => {
//       post.votes = post.votes.concat(req.body)
//       post.save((err) => {
//         if (err) {
//           console.log(err)
//           return res.status(500).send(err)
//         }
//         return res.send(post)
//       })
//     })
//     .catch(err => {
//       console.log(err)
//       next()
//     })
// })

router.post('/:postId/upvote', (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      post.votes[0].value++
      return post.save()
    })
    .then(() => res.send({
      message: "Upvoted"
    }))
    .catch(next)
})

module.exports = router