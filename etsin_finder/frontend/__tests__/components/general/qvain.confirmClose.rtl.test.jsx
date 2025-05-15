import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

import {
  ConfirmClose,
  ConfirmDialog,
} from '../../../js/components/qvain/general/modal/confirmClose'

import { contextRenderer } from '@/../__tests__/test-helpers'
import { buildStores } from '@/stores'

describe('ConfirmDialog', () => {
  const props = {
    show: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
    content: {
      warning: 'warning',
      cancel: 'cancel',
      confirm: 'confirm',
    },
  }

  const renderDialog = extraProps => {
    const parsedProps = { ...props, ...extraProps }
    return contextRenderer(<ConfirmDialog {...parsedProps} />)
  }

  test('should not render when show=false', () => {
    const { container } = renderDialog({ show: false })
    expect(container.children).toHaveLength(0)
  })

  describe('given minimal props (with show:true)', () => {
    describe('ResponseOverlay', () => {
      test('should have content of content.warning', () => {
        renderDialog()
        expect(screen.getByText(props.content.warning)).toBeInTheDocument()
      })

      test('should call onCancel when CancelButton is clicked', async () => {
        renderDialog()
        const cancelButton = screen.getByRole('button', { name: props.content.cancel })
        await userEvent.click(cancelButton)
        expect(props.onCancel.mock.calls).toHaveLength(1)
      })

      test('should call onConfirm when ConfirmButton is clicked', async () => {
        renderDialog()
        const confirmButton = screen.getByRole('button', { name: props.content.confirm })
        await userEvent.click(confirmButton)
        expect(props.onConfirm.mock.calls).toHaveLength(1)
      })
    })
  })
})

describe('ConfirmClose', () => {
  test('should render confirmation dialog', () => {
    const props = {
      show: true,
      onCancel: jest.fn(),
      onConfirm: jest.fn(),
    }

    contextRenderer(<ConfirmClose {...props} />, { stores: buildStores() })
    expect(screen.getByText('You have unsaved changes.', { exact: false })).toBeInTheDocument()
  })
})
