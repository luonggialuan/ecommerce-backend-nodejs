'use strict'
const mongoose = require('mongoose')
const {
  db: { host, port, name }
} = require('../configs/config.mongodb')
const { countConnect, checkOverload } = require('../helpers/check.connect')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
  constructor() {
    this._connect()
  }

  // connect to the database
  _connect(type = 'mongodb') {
    // dev
    if (1 === 1) {
      mongoose.set('debug', true)
      mongoose.set('debug', { color: true })
    }

    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => {
        console.log('Database connection successful')
      })
      .catch((err) => {
        console.error('Database connection error')
      })

    countConnect()
    // checkOverload()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Database()
    }
    return this.instance
  }
}

const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb
