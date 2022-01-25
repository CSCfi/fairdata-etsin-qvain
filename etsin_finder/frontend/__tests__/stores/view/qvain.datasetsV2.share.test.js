import Share from '../../../js/stores/view/qvain/qvain.datasetsV2.share'

const share = new Share()

describe('given no inviteResults', () => {
  it('inviteSuccessUsers should return empty array', () => {
    share.inviteSuccessUsers.should.eql([])
  })

  it('inviteFailUsers should return empty array', () => {
    share.inviteFailUsers.should.eql([])
  })
})
