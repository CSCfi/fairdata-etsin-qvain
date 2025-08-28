import '@testing-library/react/dont-cleanup-after-each' // disable automatic cleanup
import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'

import './ensureTextEncoder' // needed by react-dom before importing test-helpers
import { Request } from 'cross-fetch'
import { registerHelpers } from './test-helpers'

// Chai is included in vitest.
chai.should() // register .should to Object.prototype

global.Request = Request // Needed by react router in tests

import '@/utils/extendYup'
import '@/utils/extendPromise'

process.env.TZ = 'Europe/Helsinki' // Use fixed timezone for tests

// userEvent needs jest.advanceTimersByTime stub needed for fake timers to work
vi.stubGlobal('jest', {
  advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
})

// Allow disabling RTL autocleanup per test file
globalThis.autoCleanup = true
afterEach(() => {
  if (globalThis.autoCleanup) {
    cleanup()
  }
})

globalThis.viExpect = globalThis.expect
globalThis.chaiExpect = chai.expect
globalThis.setExpect = framework => {
  globalThis.expect = globalThis[`${framework}Expect`]
}

vi.setConfig({ testTimeout: 10000 })

registerHelpers()
