import { observable, action } from 'mobx'
import axios from 'axios'
// import Locale from './language'
import Env from '../domain/env'

class DatasetQuery {
  @observable results = []
  @observable emailInfo = []
  @observable directories = []
  @observable error = false
  metaxUrl = Env.metaxUrl

  @action
  getData(id) {
    console.log('DatasetQuery', id)
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
  getFolderData(id) {
    console.log('Folder Query')
    return new Promise((resolve, reject) => {
      axios
        .get(`${this.metaxUrl}/rest/directories/${id}/files`)
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
