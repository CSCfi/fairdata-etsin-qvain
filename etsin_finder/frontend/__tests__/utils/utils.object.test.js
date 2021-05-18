import getPath from '../../js/components/qvain/utils/object'

describe('when calling getPath with existing path', () => {
  const obj = {
    path: {
      to: {
        value: 'value',
      },
    },
  }

  test('should return value', () => {
    getPath('path.to.value', obj).should.eql('value')
  })
})
