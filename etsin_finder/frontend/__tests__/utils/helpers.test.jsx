import React from 'react'
import { hasChildren } from '../../js/utils/helpers'

describe('Helper functions', () => {
  describe('hasChildren', () => {
    describe('hasChildren is false', () => {
      it('returns false for empty', () => {
        expect(hasChildren()).toEqual(false)
      })
      it('returns false for null', () => {
        expect(hasChildren(null)).toEqual(false)
      })
      it('returns false for empty array', () => {
        expect(hasChildren([])).toEqual(false)
      })
      it('returns false for array with null', () => {
        expect(hasChildren([null])).toEqual(false)
      })
      it('returns false for array full of undefined objects', () => {
        expect(hasChildren([undefined, undefined, undefined])).toEqual(false)
      })
    })
    describe('hasChildren is true', () => {
      it('returns true for string', () => {
        expect(hasChildren('string')).toEqual(true)
      })
      it('returns true for string in array', () => {
        expect(hasChildren(['string'])).toEqual(true)
      })
      it('returns true for array with last as string', () => {
        expect(hasChildren([undefined, undefined, 'string'])).toEqual(true)
      })
      it('returns true for object inside array', () => {
        expect(hasChildren([undefined, undefined, { obj: 'something' }])).toEqual(true)
      })
      it('returns true for element', () => {
        expect(hasChildren(<div>hi</div>)).toEqual(true)
      })
    })
  })
})
