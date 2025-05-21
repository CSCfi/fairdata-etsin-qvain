import buildColumns from '../../js/utils/buildColumns'

describe('buildColumns', () => {
  it('should build 1-column template', () => {
    buildColumns([['name', '1fr']]).should.equal('[name-start] 1fr [name-end]')
  })

  it('should build 2-column template', () => {
    buildColumns([
      ['name', '2fr'],
      ['category', '1fr'],
    ]).should.equal('[name-start] 2fr [name-end category-start] 1fr [category-end]')
  })

  it('should build 3-column template', () => {
    buildColumns([
      ['name', '2fr'],
      ['category', '1fr'],
      ['another', '3fr'],
    ]).should.equal(
      '[name-start] 2fr [name-end category-start] 1fr [category-end another-start] 3fr [another-end]'
    )
  })
})
