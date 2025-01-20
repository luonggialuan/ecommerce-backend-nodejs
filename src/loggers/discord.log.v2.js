'use strict'
const { Client, GatewayIntentBits } = require('discord.js')
require('dotenv').config()
const { CHANELID_DISCORD, TOKEN_DISCORD } = process.env

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
      ]
    })

    this.chanelId = CHANELID_DISCORD

    this.client.on('ready', () => {
      console.log(`Logged in as ${this.client.user.tag}`)
    })

    this.client.login(TOKEN_DISCORD)
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = 'This is some additional information about the code',
      title = 'Code Example'
    } = logData

    if (1 === 1) {
      // product and dev
    }

    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt('00ff00', 16),
          title,
          description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
        }
      ]
    }

    this.sendToMessage(codeMessage)
  }

  sendToMessage(message = 'message') {
    const channel = this.client.channels.cache.get(this.chanelId)
    if (!channel) {
      console.error(`Could find the chanel...`, this.chanelId)
      return
    }

    // cand use chatgpt api
    channel.send(message).catch((e) => console.error(e))
  }
}

module.exports = new LoggerService()
