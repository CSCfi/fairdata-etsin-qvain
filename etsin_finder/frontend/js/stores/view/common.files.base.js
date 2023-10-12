import { observable, action, runInAction, computed, makeObservable } from 'mobx'

import { Project } from './common.files.items'
import PromiseManager from '../../utils/promiseManager'
import { itemLoaderPublic } from './common.files.loaders'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import Sort from './common.files.sort'

class FilesBase {
  // Base class for file hierarchies.

  constructor(Env) {
    this.Env = Env
    this.promiseManager = new PromiseManager()
    this.client = new AbortClient()
    FilesBase.prototype.reset.call(this)
    makeObservable(this)
  }

  @observable datasetIdentifier = null

  @observable root = null // project root

  @observable selectedProject = undefined

  @observable projectLocked = false // prevent changing saved project

  @observable loadingProjectRoot = null

  cache = {} // used for storing data for items that haven't been fully loaded yet

  @observable initialLoadCount = 200

  @action async reset() {
    this.datasetIdentifier = null
    this.root = null
    this.selectedProject = undefined
    this.cache = {}
    this.projectLocked = false
    this.loadingProjectRoot = null
    this.client.abort()
  }

  // eslint-disable-next-line no-unused-vars
  @action.bound async openDataset(dataset) {
    throw new Error('not implemented')
  }

  // eslint-disable-next-line no-unused-vars
  async fetchRootIdentifier(projectIdentifier) {
    throw new Error('not implemented')
  }

  @action.bound async loadAllDirectories() {
    const loadChildren = async dir =>
      Promise.all(
        dir.directories.map(async d => {
          await this.loadDirectory(d)
          return loadChildren(d)
        })
      )
    await loadChildren(this.root)
  }

  @action.bound async loadDirectory(dir) {
    return itemLoaderPublic.loadDirectory({
      Files: this,
      dir,
      totalLimit: this.initialLoadCount,
      sort: new Sort(),
    })
  }

  @action.bound async loadProjectRoot() {
    const alreadyLoading =
      this.loadingProjectRoot && this.loadingProjectRoot.identifier === this.selectedProject
    if (alreadyLoading || (this.root && this.root.projectIdentifier === this.selectedProject)) {
      return
    }
    this.root = null
    if (!this.selectedProject) {
      return
    }

    const loadRoot = async projectIdentifier => {
      const rootIdentifier = await this.fetchRootIdentifier(projectIdentifier)
      const root = observable(Project(projectIdentifier, rootIdentifier))
      await this.loadDirectory(root)
      runInAction(() => {
        if (root && (root.directories.length > 0 || root.files.length > 0)) {
          this.root = root
        }
      })
    }

    let promise
    try {
      promise = loadRoot(this.selectedProject)
      this.loadingProjectRoot = {
        identifier: this.selectedProject,
        promise,
        error: null,
        done: false,
      }
      await this.loadingProjectRoot.promise
    } catch (error) {
      if (isAbort(error)) {
        throw error
      }
      console.error(error)

      runInAction(() => {
        this.root = null
        this.loadingProjectRoot.error = error
      })
    } finally {
      runInAction(() => {
        if (this.loadingProjectRoot?.promise === promise) {
          this.loadingProjectRoot.done = true
        }
      })
    }
  }

  getItemByPath = async (path, skipFinalLoad) => {
    // Get file or directory by path. Loads all parent directories in the path
    // automatically if needed. Fails to find item if it's not found within the first
    // initialLoadCount items of a directory.
    const parts = path.split('/')
    if (parts.length === 1) {
      return undefined
    }
    if (path === '/') {
      return this.root
    }
    let dir = this.root
    let prevDir = dir
    for (let i = 1; i < parts.length; i += 1) {
      const part = parts[i]
      dir = dir.directories.find(d => d.name === part)
      if (dir && !dir.loaded) {
        if (i < parts.length - 1 || !skipFinalLoad) {
          // eslint-disable-next-line no-await-in-loop
          await this.loadDirectory(dir)
        }
      }
      if (!dir) {
        const file = prevDir.files.find(f => f.name === part)
        return file
      }
      prevDir = dir
    }
    return dir
  }

  getItemPath = item => {
    if (item.parent && item.parent.type === 'directory') {
      return `${this.getItemPath(item.parent)}/${item.name}`
    }
    return `/${item.name}`
  }

  @computed get isLoadingProject() {
    return this.loadingProjectRoot && !this.loadingProjectRoot.done
  }

  @computed get loadingProjectError() {
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      return this.loadingProjectRoot.error
    }
    return null
  }

  @action.bound async retry() {
    if (this.loadingProjectRoot && this.loadingProjectRoot.error) {
      this.loadingProjectRoot = null
    }
    return this.loadProjectRoot()
  }
}

export default FilesBase
