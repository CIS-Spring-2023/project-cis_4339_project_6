const express = require('express')
const router = express.Router()
const org = process.env.ORG

// importing data model schemas
const { services } = require('../models/models')

// GET all services related to org
router.get('/', (req, res, next) => {
  services.find({ org: org }, (error, data) => {
    if (error) {
      return next(error)
    } else {
      return res.json(data), console.log(data)
    }
  })
})

// GET single service by ID
router.get('/id/:id', (req, res, next) => {
  // use findOne instead of find to not return array
  services.findOne({ _id: req.params.id }, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Service not found')
    } else {
      res.json(data)
    }
  })
})

// POST new service
router.post('/', (req, res, next) => {
  const newService = req.body
  newService.orgs = [org]
  services.create(newService, (error, data) => {
    if (error) {
      return next(error)
    } else {
      res.json(data)
    }
  })
})

// PUT update Service
router.put('/update/:id', (req, res, next) => {
  services.findByIdAndUpdate(req.params.id, req.body, (error, data) => {
    if (error) {
      return next(error)
    } else {
      services.name = res.json(data.name)
      //  res.json(data)
    }
  })
})

/**Not currently in use */
// hard DELETE service by ID, as per project specifications
router.delete('/:id', (req, res, next) => {
  services.findByIdAndDelete(req.params.id, (error, data) => {
    if (error) {
      return next(error)
    } else if (!data) {
      res.status(400).send('Service not found')
    } else {
      res.send('Service deleted')
    }
  })
})

module.exports = router
