import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'

import Button, { InvertedButton } from '../../../../general/button'

const createPackage = async Packages => {
  Packages.Notifications.validateEmail()
  if (Packages.Notifications.emailError) {
    return
  }
  await Packages.createPackageFromPath(Packages.packageModalPath)
  Packages.closePackageModal()
}

const submitEmail = async Packages => {
  Packages.Notifications.validateEmail(true)
  if (Packages.Notifications.emailError) {
    return
  }
  await Packages.Notifications.subscribeToPath(Packages.packageModalPath)
  Packages.closePackageModal()
}

const button = component => {
  component.propTypes = {
    Packages: PropTypes.object.isRequired,
  }
  return observer(component)
}

export const CreatePackageButton = button(({ Packages }) => (
  <Translate
    component={Button}
    content="dataset.dl.packages.modal.buttons.ok"
    color="success"
    onClick={() => createPackage(Packages)}
  />
))

export const SubmitEmailButton = button(({ Packages }) => (
  <Translate
    component={Button}
    content="dataset.dl.packages.modal.buttons.submitEmail"
    color="success"
    onClick={() => submitEmail(Packages)}
  />
))

export const CancelButton = button(({ Packages }) => (
  <Translate
    component={InvertedButton}
    content="dataset.dl.packages.modal.buttons.cancel"
    color="success"
    onClick={Packages.closePackageModal}
  />
))

export const CloseButton = button(({ Packages }) => (
  <Translate
    component={InvertedButton}
    content="dataset.dl.packages.modal.buttons.close"
    color="success"
    onClick={Packages.closePackageModal}
  />
))

export const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
  margin: -1rem;
  margin-top: -0.5rem;
  align-self: center;
  width: 75%;
  > * {
    margin: 0.5rem;
    border-radius: 0;
    padding: 0.75rem 2rem;
  }
`

export const Header = styled.h2`
  text-align: center;
  border-bottom: 1px solid ${p => p.theme.color.lightgray};
`
