import { DATA_CATALOG_IDENTIFIER } from '../../../js/utils/constants'
import EnvClass from '../../../js/stores/domain/env'
import LocaleClass from '../../../js/stores/view/locale'
import QvainClass from '../../../js/stores/view/qvain'
import AuthClass from '@/stores/domain/auth'
import type Qvain from '../../../js/stores/view/qvain'

describe('data catalog', () => {
  let Qvain: Qvain

  beforeEach(() => {
    const Env = new EnvClass()
    const Auth = new AuthClass(Env)
    const Locale = new LocaleClass(Env)
    Qvain = new QvainClass(Env, Auth, Locale)
  })

  test('DaaS catalog should always use URN', () => {
    Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.DAAS)
    expect(Qvain.useDoi).toBe(false)
  })

  test('ATT catalog should always use URN', () => {
    Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.ATT)
    expect(Qvain.useDoi).toBe(false)
  })

  test('DaaS catalog should always use URN even if DOI was selected', () => {
    Qvain.useDoi = true
    Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.DAAS)
    expect(Qvain.useDoi).toBe(false)
  })

  test('ATT catalog should always use URN even if DOI was selected', () => {
    Qvain.useDoi = true
    Qvain.setDataCatalog(DATA_CATALOG_IDENTIFIER.ATT)
    expect(Qvain.useDoi).toBe(false)
  })
})
