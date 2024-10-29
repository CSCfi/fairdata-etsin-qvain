export function attachMandatoryArgs(args) {
  if (!this.mandatoryArgs) {
    console.error(`Mandatory args not found in ${this.constructor.name}`)
  }

  if (!args) {
    console.error(`No args were given in ${this.constructor.name}`)
  }

  this.mandatoryArgs.forEach(ma => {
    if (!Object.keys(args).includes(ma)) {
      console.error(`Mandatory arg ${ma} not found in ${this.constructor.name}`)
    }

    this[ma] = args[ma]
  })
}
