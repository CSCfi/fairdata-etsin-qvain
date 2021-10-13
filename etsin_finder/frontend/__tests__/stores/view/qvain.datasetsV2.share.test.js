import { combineName } from '../../../js/stores/view/qvain/qvain.datasetsV2.share'

describe('combineName', () => {
  it('should combine first and last name', () => {
    combineName('mauno', 'ahonen').should.eql('mauno ahonen')
  })

  it('should ignore missing last name', () => {
    combineName('mauno', undefined).should.eql('mauno')
  })

  it('should ignore missing first name', () => {
    combineName(undefined, 'ahonen').should.eql('ahonen')
  })
})
