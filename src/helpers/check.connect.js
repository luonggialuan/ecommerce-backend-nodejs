;('use strict')

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')

const _SECONDS = 5000

// count Connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections::${numConnection}`)
}

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024

    console.log(`Active connections::${numConnection}`)
    console.log(`Memory usage:: ${memoryUsage} MB`)

    // Example maximum number of connections based on cores
    const maxConnections = numCores * 5

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`)
      // notify.send(...)
    }
  }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
  countConnect,
  checkOverload
}
