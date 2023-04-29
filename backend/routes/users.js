const express = require('express')
var bcrypt = require('bcrypt')
const router = express.Router()

const org = process.env.ORG

// importing data model schema for users
const { users } = require('../models/models')

// Function to generata a salt and hash of password when a user registers
generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
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

// GET user by username
router.get('/:username', (req, res, next) => {
  // use findOne instead of find to not return array
  users.findOne({ username: req.params.username }, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('User not found')
    } else {
      res.json(data)
    }
  })
})

/** User registration endpoint.
 * Only utilized to create new users and test
 * password functionality using Postman
 * NOT A PROJECT REQUIREMENT
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

// User authentication endpoint
router.post('/userAuthentication', (req, res, next) => {
  users.findOne({ username: req.body.username }, (error, users) => {
    if (!users) {
      return res.status(400).send('Invalid Username')
    } else if (!users.validPassword(req.body.password)) {
      res.status(400).send('Incorrect Password')
    } else if (error) {
      return next(error)
    } else {
      res.json(users)
    }
  })
})

module.exports = router
