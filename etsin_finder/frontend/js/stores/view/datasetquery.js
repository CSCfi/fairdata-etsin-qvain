/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2018 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import { observable, computed, action, makeObservable } from 'mobx'
import axios from 'axios'

import createFilesStore from './etsin/etsin.files'
import Packages from './packages'
import urls from '../../utils/urls'

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
  constructor(Env, Access) {
    this.Env = Env
    this.Files = createFilesStore(Env)
    this.Packages = new Packages(Env)
    this.Access = Access
    makeObservable(this)
  }

  @observable results = null

  @observable emailInfo = null

  @observable directories = []

  @observable error = false

  @observable showCitationModal = false

  @action setShowCitationModal = value => {
    this.showCitationModal = value
  }

  async fetchPackages() {
    if (!this.results || !this.Access.restrictions?.allowDataIdaDownloadButton) {
      return
    }

    await this.Packages.fetch(this.results.identifier)
  }

  @computed get isPas() {
    return (
      this.results?.data_catalog?.catalog_json?.identifier === 'urn:nbn:fi:att:data-catalog-pas'
    )
  }

  @computed get isDraft() {
    if (this.results) {
      if (this.results.draft_of || this.results.state === 'draft') {
        return true
      }
    }
    return false
  }

  @action
  getData(id) {
    this.Packages.clearPackages()
    const url = urls.dataset(id)
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(
          action(async res => {
            this.results = res.data.catalog_record
            this.emailInfo = res.data.email_info
            this.Access.updateAccess(
              res.data.catalog_record.research_dataset.access_rights,
              res.data.has_permit ? res.data.has_permit : false,
              res.data.application_state ? res.data.application_state : undefined
            )

            resolve(res.data)
          })
        )
        .catch(
          action(error => {
            this.error = error
            this.results = []
            this.emailInfo = []
            this.directories = []
            reject(error)
          })
        )
    })
  }

  @action
  async fetchAndStoreFiles() {
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

export default DatasetQuery
