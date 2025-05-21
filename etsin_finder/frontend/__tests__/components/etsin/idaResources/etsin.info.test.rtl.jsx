import { cleanup, screen } from '@testing-library/react'
import ReactModal from 'react-modal'
import { contextRenderer } from '@/../__tests__/test-helpers'
import Info from '@/components/etsin/Dataset/data/info.jsx'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'

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
    it('renders text in InfoItem', () => {
      const props = {
        ...minimalProps,
        checksum: 'SHA:1234',
      }
      contextRenderer(<Info {...props} />)
      const component = screen.getByText('Checksum (SHA)')
      expect(component).toBeTruthy()
    })
  })
})
