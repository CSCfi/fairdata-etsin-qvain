import checkNested from '../../js/utils/checkNested'

describe('CheckNested function', () => {
  const researchDataset = { publisher: { name: 'Test' } }
  it('should return false for no object', () => {
    const checked = checkNested()
    expect(checked).toEqual(false)
  })
  it('should return false for undefined object', () => {
    const checked = checkNested(researchDataset, 'test')
    expect(checked).toEqual(false)
  })
  it('should return true for defined object', () => {
    const checked = checkNested(researchDataset, 'publisher', 'name')
    expect(checked).toEqual(true)
  })
})
