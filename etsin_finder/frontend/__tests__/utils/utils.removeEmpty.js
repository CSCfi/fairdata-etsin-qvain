import removeEmpty from '../../js/utils/removeEmpty'

it('removes empty nested values', () => {
  const obj = {
    a: 1,
    b: '',
    c: null,
    d: undefined,
    e: {
      f: null,
      g: 2,
    },
    h: [3, 4, undefined, null, 5],
    i: 'moro',
    j: { k: {}, l: [{}] },
    m: [undefined, null, {}],
    n: ['0'],
    o: 0,
  }
  const expected = { a: 1, e: { g: 2 }, h: [3, 4, 5], i: 'moro', n: ['0'], o: 0 }
  expect(removeEmpty(obj)).toEqual(expected)
})

it('preserves type for arrays', () => {
  const removed = removeEmpty([1, 2, 3, [], 4])
  expect(removed).toEqual([1, 2, 3, 4])
  expect(Array.isArray(removed)).toBe(true)
})
