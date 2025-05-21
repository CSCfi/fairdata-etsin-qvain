/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { hasChildren } from '../../js/utils/helpers'

const Hello = () => <div>Hello!</div>

const Children = ({ children }) => <div>{children}</div>

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
      it('returns false for nested object containing null', () => {
        expect(hasChildren(<div>{null}</div>)).toEqual(false)
      })
      it('returns false for component that has empty children array', () => {
        expect(hasChildren(<Children>{[]}</Children>)).toEqual(false)
      })
      it('returns false for nested object containing empty array', () => {
        expect(hasChildren(<div>{[]}</div>)).toEqual(false)
      })
      it('returns false for array that has only empty objects', () => {
        expect(hasChildren([undefined, <div>{undefined}</div>])).toEqual(false)
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
      it('returns true for component without children', () => {
        expect(hasChildren(<Hello />)).toEqual(true)
      })
      it('returns true for array that has a nested object', () => {
        expect(
          hasChildren([
            undefined,
            <div>
              <div>Hello World!</div>
            </div>,
          ])
        ).toEqual(true)
      })
    })
  })
})
