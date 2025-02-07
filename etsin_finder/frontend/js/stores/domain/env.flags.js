/**
 * This file is part of the Etsin service
 *
 * Copyright 2017-2020 Ministry of Education and Culture, Finland
 *
 *
 * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
 * @license   MIT
 */

import axios from 'axios'
import {
  action,
  makeObservable,
  observable,
  extendObservable,
  computed,
  runInAction,
  when,
} from 'mobx'

//  Match last part of dot-separated path (including the period), e.g. '.last' in 'first.second.last'
const lastPartRegex = /\.?[^.]*$/

// supportedFlags has the following possible states for a flag:
// - 'full': flag is supported
// - 'partial': flag is a group and can be set, but is not a valid flag by itself (flagEnabled will warn)
// - undefined: flag is unsupported (flagEnabled/validateFlags will warn)
const FLAG_SUPPORT = {
  FULL: 'full',
  PARTIAL: 'partial',
  NO: undefined,
}

class Flags {
  constructor(Env) {
    makeObservable(this)
    this.Env = Env

    // Global flag helpers for front-end development. The functions do not modify
    // flags directly but instead the values are kept in the overrides object.
    // The values are stored in localStorage.
    //   setFlag: set a flag value
    //   getFlags: get all flag values in effect (flags + overrides)
    //   flagEnabled: is a flag enabled
    //   resetFlags: reset flags to original values (clears overrides)
    //   cleanupFlags: reset flags that aren't supported
    extendObservable(this, {
      overrides: {},
    })

    // Apply existing overrides starting from shortest paths
    window.applyOverrides = () => {
      const overridesList = Object.entries(
        JSON.parse(localStorage.getItem('flagOverrides')) || {}
      )
      overridesList.sort(([pathA], [pathB]) => pathA.split('.').length - pathB.split('.').length)
      overridesList.forEach(([path, value]) => this.setOverride(path, value))
    }
    window.applyOverrides()

    window.flagEnabled = this.flagEnabled

    window.getFlags = () => JSON.parse(JSON.stringify(this.activeFlags))

    window.setFlag = action((flagPath, value) => {
      if (this.supportedFlags && !this.validateFlagPath(flagPath)) {
        console.warn(`unsupported flag: ${flagPath}`)
      }

      if (typeof flagPath !== 'string') {
        console.error('expected string flag path')
        return
      }
      this.setOverride(flagPath, value)
      localStorage.setItem('flagOverrides', JSON.stringify(this.overrides))
    })

    window.cleanupFlags = action(() => {
      for (const path of Object.keys(this.overrides)) {
        if (this.supportedFlags && !this.validateFlagPath(path)) {
          delete this.overrides[path]
        }
      }
      localStorage.setItem('flagOverrides', JSON.stringify(this.overrides))
    })

    window.resetFlags = action(() => {
      this.overrides = {}
      localStorage.removeItem('flagOverrides')
    })
  }

  @observable flags = {}

  @observable supportedFlags = null

  @observable fetchingSupportedFlags = false

  @action setSupportedFlags(paths) {
    this.supportedFlags = {}
    paths.forEach(flagPath => {
      let partialPath = flagPath
      this.supportedFlags[partialPath] = FLAG_SUPPORT.FULL
      partialPath = partialPath.replace(lastPartRegex, '')
      while (partialPath) {
        this.supportedFlags[partialPath] = this.supportedFlags[partialPath] || FLAG_SUPPORT.PARTIAL
        partialPath = partialPath.replace(lastPartRegex, '')
      }
    })
  }

  @action async fetchSupportedFlags() {
    if (this.fetchingSupportedFlags) {
      await when(() => !this.fetchingSupportedFlags)
      return
    }

    this.fetchingSupportedFlags = true
    try {
      const { data } = await axios.get('/api/supported_flags')
      this.setSupportedFlags(data)
    } finally {
      runInAction(() => {
        this.fetchingSupportedFlags = false
      })
    }
  }

  @action validateFlagPath(path) {
    return this.supportedFlags[path] || FLAG_SUPPORT.undefined
  }

  @action async validateFlags() {
    if (!this.supportedFlags) {
      await this.fetchSupportedFlags()
    }

    let ok = true
    for (const path of Object.keys(this.flags)) {
      if (!this.validateFlagPath(path)) {
        console.warn(`unsupported flag: ${path}`)
        ok = false
      }
    }

    for (const path of Object.keys(this.overrides)) {
      if (!this.validateFlagPath(path)) {
        console.warn(`unsupported flag override: ${path}, call cleanupFlags() to remove`)
        ok = false
      }
    }
    return ok
  }

  @action setFlags(flags) {
    this.flags = flags
    if (this.overrides && window.applyOverrides) {
      window.applyOverrides()
    }
  }

  @action setOverride(path, value) {
    this.overrides[path] = value
    const pathPrefix = `${path}.`

    // replace child override values with parent
    for (const flagPath of Object.keys(this.overrides)) {
      if (flagPath.startsWith(pathPrefix)) {
        this.overrides[flagPath] = undefined
      }
    }

    // replace child flag values with override
    for (const flagPath of Object.keys(this.flags)) {
      if (flagPath.startsWith(pathPrefix)) {
        this.overrides[flagPath] = undefined
      }
    }
  }

  @action setFlag(path, value) {
    this.flags[path] = value

    // child items will use value from parent
    const pathPrefix = `${path}.`
    for (const flagPath of Object.keys(this.flags)) {
      if (flagPath.startsWith(pathPrefix)) {
        this.flags[flagPath] = undefined
      }
    }
  }

  @computed get activeFlags() {
    if (this.overrides) {
      return { ...this.flags, ...this.overrides }
    }
    return this.flags
  }

  flagEnabled = flagPath => {
    if (this.supportedFlags && this.validateFlagPath(flagPath) !== FLAG_SUPPORT.FULL) {
      console.warn(`flagEnabled called with unsupported flag: ${flagPath}`)
    }
    if (BUILD !== 'test') {
      if (this.Env?.appConfigLoaded === false) {
        console.warn(`flagEnabled called before app config has been loaded, flag: ${flagPath}`)
      }
    }

    let path = flagPath
    while (path) {
      const value = this.activeFlags[path]
      if (value != null) {
        return value
      }
      path = path.replace(lastPartRegex, '')
    }
    return false
  }
}

export default Flags
