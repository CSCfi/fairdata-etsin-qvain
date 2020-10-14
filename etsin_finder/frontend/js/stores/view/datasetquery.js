/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action, makeObservable, runInAction } from 'mobx'
import axios from 'axios'

import access from './access'

import Files from './files'

const QueryFields = {
  file: [
    'file_path',
    'file_name',
    'file_format',
    'identifier',
    'byte_size',
    'open_access',
    'file_format',
    'file_characteristics',
    'checksum_value',
  ],
  directory: ['directory_path', 'directory_name', 'identifier', 'file_count', 'byte_size'],
}

class DatasetQuery {
  constructor(Env) {
    this.Files = new Files()
    this.Env = Env
    makeObservable(this)
  }

  @observable results = null

  @observable emailInfo = null

  @observable directories = []

  @observable error = false

  @observable packageRequests = {}

  async fetchPackageRequests() {
    // Fetch list of available downloadable packages
    const { downloadApiV2 } = this.Env
    if (!downloadApiV2 || !this.results) {
      return
    }

    let response
    try {
      const url = `/api/v2/dl/requests?cr_id=${this.results.identifier}`
      response = await axios.get(url)
    } catch (err) {
      runInAction(() => {
        this.packageRequests = {}
      })
      if (err.response && err.response.status === 404) {
        return
      }
      throw err
    }

    const { partial, ...full } = response.data
    const requests = { '/': full };
    (partial || []).forEach(req => {
      if (req.scope.length === 1) {
        requests[req.scope] = req
      }
    })

    runInAction(() => {
      this.packageRequests = requests
    })
  }

  @action
  getData(id) {
    const { metaxApiV2 } = this.Env
    const url = metaxApiV2 ? `/api/v2/dataset/${id}` : `/api/dataset/${id}`
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(action(async res => {
          this.results = res.data.catalog_record
          this.emailInfo = res.data.email_info
          access.updateAccess(
            res.data.catalog_record.research_dataset.access_rights,
            res.data.has_permit ? res.data.has_permit : false,
            res.data.application_state ? res.data.application_state : undefined
          )

          resolve(res.data)
        }))
        .catch(action(error => {
          this.error = error
          this.results = []
          this.emailInfo = []
          this.directories = []
          reject(error)
        }))
    })
  }

  @action
  async fetchAndStoreFiles() {
    const { metaxApiV2 } = this.Env
    if (metaxApiV2) {
      return this.Files.openDataset(this.results)
    }
    return null
  }

  @action
  getFolderData(id, crID) {
    const fileFields = QueryFields.file.join(',')
    const dirFields = QueryFields.directory.join(',')
    return new Promise((resolve, reject) => {
      axios
        .get(
          `/api/files/${crID}?dir_id=${id}&file_fields=${fileFields}&directory_fields=${dirFields}`
        )
        .then(res => {
          this.directories.push({ id, results: res.data })
          resolve(res.data)
        })
        .catch(error => {
          this.directories.push({ id, error })
          reject(error)
        })
    })
  }
}

export default DatasetQuery
