import sizeParse from '../../js/utils/sizeParse'

describe('sizeParse function', () => {
  it('Bytes', () => {
    const size = sizeParse(100, 2)
    expect(size).toEqual('100 Bytes')
  })
  it('KB', () => {
    const size = sizeParse(1500, 2)
    expect(size).toEqual('1.46 KB')
  })
  it('MB', () => {
    const size = sizeParse(3900000, 2)
    expect(size).toEqual('3.72 MB')
  })
  it('GB', () => {
    const size = sizeParse(5000000000, 2)
    expect(size).toEqual('4.66 GB')
  })
  describe('Decimals', () => {
    it('Zero decimals', () => {
      const size = sizeParse(5000000000, 0)
      expect(size).toEqual('5 GB')
    })
    it('One decimals', () => {
      const size = sizeParse(5000000000, 1)
      expect(size).toEqual('4.7 GB')
    })
    it('Three decimals', () => {
      const size = sizeParse(5000000000, 3)
      expect(size).toEqual('4.657 GB')
    })
    it('Four decimals', () => {
      const size = sizeParse(5000000000, 4)
      expect(size).toEqual('4.6566 GB')
    })
    it('Should return two decimals if no decimal specified', () => {
      const size = sizeParse(5000000000)
      expect(size).toEqual('4.66 GB')
    })
  })
})
