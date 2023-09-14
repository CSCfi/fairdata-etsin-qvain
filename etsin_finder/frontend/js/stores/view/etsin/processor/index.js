/*
  Interface for Etsin processor class.

*/
import { makeObservable, action } from 'mobx'
import AbortClient from '@/utils/AbortClient'

class EtsinProcessor {
  constructor(Env) {
    this.Env = Env
    this.client = new AbortClient()
    makeObservable(this)
  }

  @action.bound
  async fetch({ id }) {
    console.error(`Fetch method is not implemented. Tried to fetch ${id}`)
  }
}

export default EtsinProcessor
