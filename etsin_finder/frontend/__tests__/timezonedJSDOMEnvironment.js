const JSDOMEnvironment = require('jest-environment-jsdom')

module.exports = class TimezonedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config) {
    // Set specific timezone for tests so they don't depend on server timezone
    process.env.TZ = process.env.TZ || 'Europe/Helsinki'
    super(config)
  }
}
