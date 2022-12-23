import Harness from '../componentTestHarness'
import { expect } from 'chai'

import LandingPage from '../../../js/components/qvain/views/landingPage'
import { useStores } from '../../../js/stores/stores'
import Description from '../../../js/components/qvain/views/landingPage/description'
import Graphics from '../../../js/components/qvain/views/landingPage/graphics'
import { FAIRDATA_WEBSITE_URL } from '../../../js/utils/constants'
import { SideBySide } from '../../../js/components/qvain/views/landingPage/box'

import QvainImage from '../../../static/images/qvain_frontpage/qvain.svg'
import EtsinImage from '../../../static/images/qvain_frontpage/etsin.svg'
import MeshImage from '../../../static/images/qvain_frontpage/mesh.png'
import MeshImage2x from '../../../static/images/qvain_frontpage/mesh@2x.png'
import IdaImage from '../../../static/images/qvain_frontpage/ida.png'
import IdaImage2x from '../../../static/images/qvain_frontpage/ida@2x.png'
import Image from '../../../js/components/qvain/views/landingPage/image'

jest.mock('../../../js/stores/stores')

describe('given mockStores', () => {
  const mockStores = {
    Accessibility: {},
    Matomo: {
      changeService: jest.fn(),
      recordEvent: jest.fn(),
    },
    Locale: {
      lang: 'en',
    },
  }

  const harness = new Harness(LandingPage)

  beforeEach(() => {
    useStores.mockReturnValue(mockStores)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('LandingPage', () => {
    beforeEach(() => {
      harness.shallow()
    })

    test('should exist', () => {
      harness.shouldExist()
    })

    test('should have children with expected properties', () => {
      const children = [
        { label: 'Description', findArgs: Description },
        { label: 'Graphics', findArgs: Graphics },
      ]

      harness.shouldIncludeChildren(children)
    })
  })

  describe('Description', () => {
    beforeEach(() => {
      harness.restoreWrapper('Description')
      harness.dive()
    })

    test('should include children with expected props', () => {
      const children = [
        {
          label: 'Header',
          findType: 'name',
          findArgs: 'description__Header',
          text: 'Qvain',
        },
        { label: 'Brief', findType: 'prop', findArgs: ['content', 'qvain.home.brief'] },
        { label: 'DescriptionText', findType: 'prop', findArgs: ['component', 'p'] },
        { label: 'HelpLink', findType: 'prop', findArgs: ['component', 'a'] },
      ]

      const props = {
        DescriptionText: {
          content: 'qvain.home.description',
        },
        HelpLink: {
          href: FAIRDATA_WEBSITE_URL.QVAIN.EN,
          content: 'qvain.home.howTo',
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('Graphics', () => {
    beforeEach(() => {
      harness.restoreWrapper('Graphics')
      harness.dive()
    })

    test('should have children with expected props', () => {
      const children = [
        {
          label: 'GraphicsContainer',
          findArgs: SideBySide,
        },
        {
          label: 'IDABox',
          findType: 'prop',
          findArgs: ['title', 'IDA'],
        },
        {
          label: 'IDABoxData',
          findType: 'prop',
          findArgs: ['content', 'qvain.home.dataInIda'],
        },
        {
          label: 'MeshBox',
          findType: 'prop',
          findArgs: ['image', MeshImage],
        },
        {
          label: 'MeshBoxData',
          findType: 'prop',
          findArgs: ['content', 'qvain.home.dataInExternal'],
        },
        {
          label: 'QvainImg',
          findType: 'prop',
          findArgs: ['title', 'Qvain'],
        },
        {
          label: 'QvainImgData',
          findType: 'prop',
          findArgs: ['content', 'qvain.home.qvainDataset'],
        },
        {
          label: 'EtsinImg',
          findType: 'prop',
          findArgs: ['title', 'Etsin'],
        },
        {
          label: 'EtsinImgData',
          findType: 'prop',
          findArgs: ['content', 'qvain.home.etsinSearch'],
        },
      ]

      const props = {
        IDABox: {
          image: IdaImage,
          image2x: IdaImage2x,
        },
        MeshImage: {
          image2x: MeshImage2x,
          arrow: true,
        },
        QvainImg: {
          image: QvainImage,
          arrow: true,
          blue: true,
        },
        EtsinImg: {
          image: EtsinImage,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })

  describe('IDABox', () => {
    beforeEach(() => {
      harness.restoreWrapper('IDABox')
      harness.dive()
    })

    test('should have children with expected props', () => {
      const children = [
        { label: 'IDABoxTitle', findArgs: 'box__BoxTitle', text: 'IDA' },
        { label: 'IDABoxImage', findArgs: Image },
        {
          label: 'IDABoxText',
          findType: 'name',
          findArgs: 'box__BoxText',
          text: harness.getWrapper('IDABoxData').text(),
        },
        {
          label: 'Arrow',
          findType: 'name',
          findArgs: 'Arrow',
        },
      ]

      const props = {
        IDABoxImage: {
          src: IdaImage,
          src2x: IdaImage2x,
        },
      }

      harness.shouldIncludeChildren(children, props)
    })
  })
})
