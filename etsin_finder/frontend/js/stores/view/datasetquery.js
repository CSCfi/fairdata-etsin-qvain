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
  @observable results = []
  @observable emailInfo = []
  @observable directories = []
  @observable error = false

  @action
  getData(id) {
    return new Promise((resolve, reject) => {
      axios
        .get(`/api/dataset/${id}`)
        .then(res => {
          this.results = res.data.catalog_record
          this.emailInfo = res.data.email_info
          resolve(res.data)
        })
        .catch(error => {
          this.error = error
          reject(error)
        })
    })
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
