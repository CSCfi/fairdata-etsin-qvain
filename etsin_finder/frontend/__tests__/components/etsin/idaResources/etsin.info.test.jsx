import ComponentHarness from '@/../__tests__/ComponentHarness'
import { cleanup, screen } from '@testing-library/react'
import Info from '@/components/dataset/data/idaResources/info.jsx'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'
import ReactModal from 'react-modal'

afterEach(cleanup)

jest.mock('@/stores/stores')
useStores.mockReturnValue(buildStores())

// avoid ReactModal warning about missing app element
const elem = document.createElement('div')
ReactModal.setAppElement(elem)

describe('Info', () => {
  const minimalProps = {
    name: 'test',
    open: true,
    closeModal: () => {},
  }

  describe('checksum given', () => {
    beforeEach(() => {
      const props = {
        ...minimalProps,
        checksum: {
          value: '1234',
          algorithm: 'SHA',
        },
      }

      ComponentHarness(Info, props)
    })

    it('renders text in InfoItem', () => {
      const component = screen.getByText('Checksum (SHA)')
      expect(component).toBeTruthy()
    })
  })
})
