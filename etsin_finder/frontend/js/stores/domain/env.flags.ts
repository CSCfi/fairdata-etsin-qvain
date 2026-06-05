import axios from 'axios'
import { action, observable, computed, runInAction, when } from 'mobx'
import type Env from './env'

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
type FlagSupport = (typeof FLAG_SUPPORT)[keyof typeof FLAG_SUPPORT]

type FlagValues = { [flagPath: string]: boolean | undefined }

declare global {
  function applyOverrides(): void
  function flagEnabled(flagPath: string): boolean
  function getFlags(): FlagValues
  function setFlag(flagPath: string, value: boolean): void
  function cleanupFlags(): void
  function resetFlags(): void
}

class Flags {
  Env: Env
  @observable accessor overrides: FlagValues = {}

  constructor(Env: Env) {
    this.Env = Env

    // Global flag helpers for front-end development. The functions do not modify
    // flags directly but instead the values are kept in the overrides object.
    // The values are stored in localStorage.
    //   setFlag: set a flag value
    //   getFlags: get all flag values in effect (flags + overrides)
    //   flagEnabled: is a flag enabled
    //   resetFlags: reset flags to original values (clears overrides)
    //   cleanupFlags: reset flags that aren't supported

    // Apply existing overrides starting from shortest paths
    globalThis.applyOverrides = () => {
      const stored = localStorage.getItem('flagOverrides')
      const overrides: FlagValues = stored ? JSON.parse(stored) : {}
      const overridesList = Object.entries(overrides)
      overridesList.sort(([pathA], [pathB]) => pathA.split('.').length - pathB.split('.').length)
      overridesList.forEach(([path, value]) => this.setOverride(path, value))
    }
    globalThis.applyOverrides()

    globalThis.flagEnabled = this.flagEnabled

    globalThis.getFlags = () => structuredClone(this.activeFlags)

    globalThis.setFlag = action((flagPath, value) => {
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

    globalThis.cleanupFlags = action(() => {
      for (const path of Object.keys(this.overrides)) {
        if (this.supportedFlags && !this.validateFlagPath(path)) {
          delete this.overrides[path]
        }
      }
      localStorage.setItem('flagOverrides', JSON.stringify(this.overrides))
    })

    globalThis.resetFlags = action(() => {
      this.overrides = {}
      localStorage.removeItem('flagOverrides')
    })
  }

  @observable accessor flags: FlagValues = {}

  @observable accessor supportedFlags: { [flagPath: string]: FlagSupport } | undefined = undefined

  @observable accessor fetchingSupportedFlags = false

  @action setSupportedFlags(paths: string[]) {
    const supportedFlags: { [flagPath: string]: FlagSupport } = {}
    paths.forEach(flagPath => {
      let partialPath = flagPath
      supportedFlags[partialPath] = FLAG_SUPPORT.FULL
      partialPath = partialPath.replace(lastPartRegex, '')
      while (partialPath) {
        supportedFlags[partialPath] = supportedFlags[partialPath] || FLAG_SUPPORT.PARTIAL
        partialPath = partialPath.replace(lastPartRegex, '')
      }
    })
    this.supportedFlags = supportedFlags
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

  @action validateFlagPath(path: string): FlagSupport {
    if (!this.supportedFlags) {
      return
    }
    return this.supportedFlags[path] || FLAG_SUPPORT.NO
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

  @action setFlags(flags: FlagValues) {
    this.flags = flags
    if (this.overrides && globalThis.applyOverrides) {
      globalThis.applyOverrides()
    }
  }

  @action setOverride(path: string, value: boolean | undefined) {
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

  @action setFlag(path: string, value: boolean) {
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

  flagEnabled = (flagPath: string) => {
    if (this.supportedFlags && this.validateFlagPath(flagPath) !== FLAG_SUPPORT.FULL) {
      console.warn(`flagEnabled called with unsupported flag: ${flagPath}`)
    }
    if (import.meta.env.MODE !== 'test') {
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
