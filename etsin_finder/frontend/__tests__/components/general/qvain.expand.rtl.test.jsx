import { screen } from '@testing-library/react'

import { buildStores } from '@/stores'
import { ExpandCollapse } from '../../../js/components/qvain/general/V2/ExpandCollapse'
import contextRenderer from '../../test-helpers/contextRenderer'

describe('ExpandCollapse', () => {
  test('should be closed with no props', () => {
    contextRenderer(<ExpandCollapse />, {
      stores: buildStores(),
    })
    expect(screen.getByLabelText('Show more')).toBeInTheDocument()
  })

  test('should open when isExpanded=true', () => {
    contextRenderer(<ExpandCollapse isExpanded />, {
      stores: buildStores(),
    })
    expect(screen.getByLabelText('Show less')).toBeInTheDocument()
  })
})
