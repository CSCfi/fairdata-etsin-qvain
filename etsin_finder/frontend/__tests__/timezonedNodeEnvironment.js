import NodeEnvironment from 'jest-environment-node'

export default class TimezonedNodeEnvironment extends NodeEnvironment {
  constructor(config, options) {
    // Set specific timezone for tests so they don't depend on server timezone
    process.env.TZ = process.env.TZ || 'Europe/Helsinki'
    super(config, options)
  }
}
