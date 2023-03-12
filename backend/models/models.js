const uuid = require('uuid')
const mongoose = require('mongoose')
var bcrypt = require('bcrypt')
const Schema = mongoose.Schema

// collection for org
const orgDataSchema = new Schema(
  {
    _id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  {
    collection: 'org'
  }
)

// collection for clients
const clientDataSchema = new Schema(
  {
    _id: { type: String, default: uuid.v1 },
    firstName: {
      type: String,
      required: true
    },
    middleName: {
      type: String
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    phoneNumber: {
      primary: {
        type: String,
        required: true
      },
      alternate: {
        type: String
      }
    },
    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      },
      city: {
        type: String,
        required: true
      },
      county: {
        type: String
      },
      zip: {
        type: String
      }
    },
    orgs: {
      type: [{ type: String, ref: 'org' }],
      required: true,
      validate: [(org) => org.length > 0, 'needs at least one org']
    }
  },

  {
    collection: 'clients'
  }
)

// collection for events
const eventDataSchema = new Schema(
  {
    _id: { type: String, default: uuid.v1 },
    org: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    services: [
      {
        type: String
      }
    ],
    date: {
      type: Date,
      required: true
    },
    address: {
      line1: {
        type: String
      },
      line2: {
        type: String
      },
      city: {
        type: String
      },
      county: {
        type: String
      },
      zip: {
        type: String
      }
    },
    description: {
      type: String
    },
    attendees: [
      {
        type: String,
        ref: 'clients'
      }
    ]
  },

  {
    collection: 'events'
  }
)

// collection for services
const servicesDataSchema = new Schema(
  {
    _id: { type: String, default: uuid.v1 },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    orgs: {
      type: [{ type: String, ref: 'org' }],
      required: true,
      validate: [(org) => org.length > 0, 'needs at least one org']
    }
  },

  {
    collection: 'service'
  }
)

// collection for users
const usersDataSchema = new Schema(
  {
    _id: { type: String, default: uuid.v1 },
    username: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    role: {
      type: String
    },
    org: {
      type: String,
      required: true
    }
  },

  {
    collection: 'user'
  }
)

// hash the password
usersDataSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
usersDataSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

/**
 * to be implemented in srint 3
 * implementation according to https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb
// hash the password
//https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb
usersDataSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSalSync(8), null)
}

// checking if password is valid
//https://stackoverflow.com/questions/43092071/how-should-i-store-salts-and-passwords-in-mongodb
usersDataSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};
 */
// create models from mongoose schemas
const clients = mongoose.model('client', clientDataSchema)
const orgs = mongoose.model('org', orgDataSchema)
const events = mongoose.model('event', eventDataSchema)
const users = mongoose.model('user', usersDataSchema)
const services = mongoose.model('service', servicesDataSchema)

// package the models in an object to export
module.exports = { clients, orgs, events, users, services }
