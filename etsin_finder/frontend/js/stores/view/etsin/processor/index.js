/*
  Interface for Etsin processor class.

*/
import { makeObservable, action } from 'mobx'

class EtsinProcessor {
  constructor() {
    makeObservable(this)
  }

  @action.bound
  async fetch({ id }) {
    console.error(`Fetch method is not implemented. Tried to fetch ${id}`)
  }
}

export default EtsinProcessor
