/*
  Interface for Etsin processor class.

*/
import AbortClient from '@/utils/AbortClient'
import type Env from '@/stores/domain/env'

interface FetchParams {
  resolved(data: any): void
  rejected(error: any): void
}

export interface GenericFetchParams {
  resolved(data: any): void
  rejected(error: any): void
  [x: string]: any
}

export interface IdFetchParams extends FetchParams {
  id: string
}

export interface DatasetFetchParams extends FetchParams {
  dataset: { identifier: string }
}

export type FetchResponse = null | {
  id: string
  promise: any
  abort: () => void | Promise<void>
}

abstract class EtsinProcessor {
  Env: Env
  client: AbortClient

  constructor(Env: Env) {
    this.Env = Env
    this.client = new AbortClient()
  }

  abstract fetch(params: GenericFetchParams): FetchResponse
}

export default EtsinProcessor
