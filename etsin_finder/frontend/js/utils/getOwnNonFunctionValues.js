/*
  Return copy of object containing only own values, with functions omitted.

  class A {
    constructor(value) {
      this.fn = this.fn.bind(this)
      this.value = value
    }

    fn() {}
  }

  getOwnNonFunctionValues(new A(1)) returns {a: 1}
*/
export const getOwnNonFunctionValues = obj => {
  return Object.fromEntries(
    Object.getOwnPropertyNames(obj)
      .filter(prop => typeof obj[prop] !== 'function')
      .map(key => [key, obj[key]])
  )
}
