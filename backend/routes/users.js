const express = require('express')
var bcrypt = require('bcrypt')
const router = express.Router()

const org = process.env.ORG

// importing data model schema for users
const { users } = require('../models/models')

generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}
validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}


/** GET all users */
router.get('/', (req, res, next) => {
  users.find({ org: org }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      console.log(data)
      return res.json(data)
    }
  })
})

/**
router.get('/username/:username', (req, res, next) => {
  // use findOne instead of find to not return array
  users.findOne({ username: req.params.username }, (error, data) => {
  // use findOne instead of find to not return array

    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('User not found')
    } else {
      res.json(data)
      console.log(data)
    }
  })
})
*/ 

// GET user by username
router.get('/:username', (req, res, next) => {
  // use findOne instead of find to not return array
  users.findOne({ username: req.params.username }, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Service not found')
    } else {
      res.json(data)
    }
  })
})

/** POST new User.  Only utilized to create new users and test
 * password has functionality using Postamn
 */
router.post('/', (req, res, next) => {
  const newUser = req.body
  newUser.org = org
  newUser.password = generateHash(req.body.password)
  hashedPassw = generateHash(req.body.password)
  users.create(newUser, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)

      console.log('Username: ', newUser.username)
      console.log('Password: ', newUser.password)
      console.log('Role: ', newUser.role)
      console.log('HashedPassw: ', hashedPassw)
    }
  })
})

module.exports = router
