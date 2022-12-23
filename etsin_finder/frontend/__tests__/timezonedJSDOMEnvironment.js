import JSDOMEnvironment from 'jest-environment-jsdom'

export default class TimezonedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(config, options) {
    // Set specific timezone for tests so they don't depend on server timezone
    process.env.TZ = process.env.TZ || 'Europe/Helsinki'
    super(config, options)
  }
}
