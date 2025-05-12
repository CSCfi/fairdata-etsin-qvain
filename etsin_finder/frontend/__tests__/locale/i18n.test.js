import english from '../../locale/english'
import finnish from '../../locale/finnish'

expect.extend({
  toMatchNestedTypes(src, dst) {
    // Check that each key in src has a key in dst with maching type.
    // Nested objects are checked recursively.
    let errors = []
    const recurse = (src, dst, path = []) => {
      for (const key in src) {
        const srcType = typeof src[key]
        const dstType = typeof dst[key]
        if (srcType !== dstType) {
          const fullPath = [...path, key].join('.')
          errors.push(`expected ${fullPath} to have type ${srcType}, received ${dstType} instead`)
        }
        if (srcType === 'object') {
          if (dst[key]) {
            recurse(src[key], dst[key], [...path, key])
          }
        }
      }
    }

    recurse(src, dst)

    if (errors.length === 0) {
      return {
        message: () => `expected src and dst not to have matching nested types`,
        pass: true,
      }
    } else {
      return {
        message: () => errors.join('\n'),
        pass: false,
      }
    }
  },
})

describe('Internationalization', () => {
  it('has a matching Finnish translation for each English translation', () => {
    expect(english).toMatchNestedTypes(finnish)
  })

  it('has a matching English translation for each Finnish translation', () => {
    expect(finnish).toMatchNestedTypes(english)
  })
})
