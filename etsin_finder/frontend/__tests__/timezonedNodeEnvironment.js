const NodeEnvironment = require('jest-environment-node')

module.exports = class TimezonedNodeEnvironment extends NodeEnvironment {
  constructor(config) {
    // Set specific timezone for tests so they don't depend on server timezone
    process.env.TZ = process.env.TZ || 'Europe/Helsinki'
    super(config)
  }
}
