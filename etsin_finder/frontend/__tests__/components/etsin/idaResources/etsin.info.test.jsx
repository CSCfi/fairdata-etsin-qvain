import { cleanup, screen } from '@testing-library/react'
import ReactModal from 'react-modal'
import { contextRenderer } from '@/../__tests__/test-helpers'
import Info from '@/components/etsin/Dataset/data/info.jsx'
import { buildStores } from '@/stores'
import { useStores } from '@/stores/stores'

afterEach(cleanup)

vi.mock('@/stores/stores')
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

  describe('data service given', () => {
    it('renders data service after type and before urls', () => {
      const props = {
        ...minimalProps,
        type: 'CSV',
        dataService: 'LUMI-AIF',
        accessUrl: 'https://access.example',
      }
      contextRenderer(<Info {...props} />)

      const typeCell = screen.getByText('CSV')
      const dataServiceCell = screen.getByText('LUMI-AIF')
      const accessUrlCell = screen.getByText('https://access.example')

      expect(typeCell.compareDocumentPosition(dataServiceCell)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
      expect(dataServiceCell.compareDocumentPosition(accessUrlCell)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      )
    })
  })
})
