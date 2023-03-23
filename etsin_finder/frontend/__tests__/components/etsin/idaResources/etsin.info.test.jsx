import etsinHarness from '../etsinHarness'
import { cleanup, screen } from '@testing-library/react'
import Info from '@/components/dataset/data/idaResources/info.jsx'

afterEach(cleanup)

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

      etsinHarness(Info, props)
    })

    it('renders text in InfoItem', () => {
      const component = screen.getByText('Checksum (SHA)')
      expect(component).toBeTruthy()
    })
  })
})
