{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import ProjectForm from './projectForm'
import { TransparentLink } from '../../../../general/button'
import Modal from '../../../../../general/modal'
import checkDataLang, { getDataLang } from '@/utils/checkDataLang'


const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

export default class Project extends Component {
  constructor(props) {
    super(props)

    const project = props.project

    this.state = {
      open: false,
      project,
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(newProps) {
    const project = newProps.project
    this.setState({
      project
    })
  }

  openModal() {
    this.setState({
      open: true,
    })
  }

  closeModal() {
    this.setState({
      open: false,
    })
  }

  render() {
    const lang = getDataLang(this.state.project.name)

    return (
      <div>
        <InlineTransparentLink
          noMargin
          noPadding
          onClick={this.openModal}
          lang={lang}
        >
          {checkDataLang(this.state.project.name)}
        </InlineTransparentLink>

        <Modal
          isOpen={this.state.open}
          onRequestClose={this.closeModal}
          customStyles={customStyles}
          contentLabel="Project"
        >
          <h2>
            <Translate content="dataset.project.project" />
          </h2>

          <ProjectForm close={this.closeModal} project={this.state.project} lang={lang} />
        </Modal>
      </div>
    )
  }
}

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
`

Project.propTypes = {
  project: PropTypes.object.isRequired
}
