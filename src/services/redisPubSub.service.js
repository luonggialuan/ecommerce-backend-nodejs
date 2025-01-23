const { createClient } = require('redis')

class RedisPubSubService {
  constructor() {
    this.subscriber = createClient() // Create subscriber client
    this.publisher = createClient() // Create publisher client

    this._ensureConnection()
  }

  async _ensureConnection() {
    try {
      // Connect both the publisher and subscriber clients
      await Promise.all([this.publisher.connect(), this.subscriber.connect()])

      console.log('Redis publisher and subscriber connected')
    } catch (err) {
      console.error('Redis connection error:', err)
    }
  }

  // Publish message to the Redis channel
  async publish(channel, message) {
    try {
      // Ensure the connection is established before publishing
      // await this._ensureConnection()

      const reply = await this.publisher.publish(channel, message)
      return reply
    } catch (err) {
      throw new Error(`Publish failed: ${err.message}`)
    }
  }

  // Subscribe to a Redis channel
  async subscribe(channel, callback) {
    try {
      // Ensure the connection is established before subscribing
      // await this._ensureConnection()

      await this.subscriber.subscribe(channel, (message) => {
        callback(channel, message)
      })
    } catch (err) {
      console.error('Subscribe failed:', err)
    }
  }

  // Close both the publisher and subscriber connections
  async close() {
    await Promise.all([this.publisher.quit(), this.subscriber.quit()])
    console.log('Redis publisher and subscriber closed')
  }
}

module.exports = new RedisPubSubService()
