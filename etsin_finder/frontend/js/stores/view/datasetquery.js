/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, action } from 'mobx'
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
  constructor() {
    this.Files = new Files()
  }

  @observable results = []

  @observable emailInfo = []

  @observable directories = []

  @observable error = false

  @action
  getData(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/dataset/${id}`)
        .then(async res => {
          this.results = res.data.catalog_record
          this.emailInfo = res.data.email_info
          access.updateAccess(
            res.data.catalog_record.research_dataset.access_rights,
            res.data.has_permit ? res.data.has_permit : false,
            res.data.application_state ? res.data.application_state : undefined
          )
          resolve(res.data)
        })
        .catch(error => {
          this.error = error
          this.results = []
          this.emailInfo = []
          this.directories = []
          reject(error)
        })
    })
  }

  @action
  fetchAndStoreFilesV2() {
    return this.Files.openDataset(this.results)
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

export default new DatasetQuery()
