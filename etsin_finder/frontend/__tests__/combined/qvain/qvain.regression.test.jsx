import { buildStores } from '../../../js/stores'
import 'chai/register-should'

jest.mock('../../../js/stores/stores')

describe('Given modified provenance with added used entity', () => {
  const mockStores = buildStores()
  let uiid

  beforeAll(() => {
    // creating a new provenance
    mockStores.Qvain.Provenances.create()
    uiid = mockStores.Qvain.Provenances.inEdit.uiid
    mockStores.Qvain.Provenances.save()
    mockStores.Qvain.Provenances.clearInEdit()
    // then edit the provenance to add a new used Entity
    mockStores.Qvain.Provenances.edit(uiid)
    mockStores.Qvain.Provenances.inEdit.usedEntities.create()
    // cancel provennace
    mockStores.Qvain.Provenances.clearInEdit()
  })

  test('Provenance should not have Used enitities', () => {
    mockStores.Qvain.Provenances.storage.length.should.eql(1)
    mockStores.Qvain.Provenances.storage[0].uiid.should.eql(uiid)
    mockStores.Qvain.Provenances.storage[0].usedEntities.storage.length.should.eql(0)
  })
})

describe('Given modified provenance with added location', () => {
  const mockStores = buildStores()
  let uiid

  beforeAll(() => {
    // creating a new provenance
    mockStores.Qvain.Provenances.create()
    uiid = mockStores.Qvain.Provenances.inEdit.uiid
    mockStores.Qvain.Provenances.save()
    mockStores.Qvain.Provenances.clearInEdit()
    // then edit the provenance to add a new location
    mockStores.Qvain.Provenances.edit(uiid)
    mockStores.Qvain.Provenances.inEdit.spatials.create()
    // cancel provennace
    mockStores.Qvain.Provenances.clearInEdit()
  })

  test('Provenance should not have Locations', () => {
    mockStores.Qvain.Provenances.storage.length.should.eql(1)
    mockStores.Qvain.Provenances.storage[0].uiid.should.eql(uiid)
    mockStores.Qvain.Provenances.storage[0].spatials.storage.length.should.eql(0)
  })
})
