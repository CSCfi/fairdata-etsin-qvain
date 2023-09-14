import React, { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'

import checkDataLang, { getDataLang } from '@/utils/checkDataLang'
import Modal from '@/components/general/modal'
import { TransparentLink } from '@/components/etsin/general/button'

import ProjectForm from './projectForm'

const Project = ({ project }) => {
  const [modalOpen, setModalOpen] = useState(false)

  const lang = getDataLang(project.name)

  return (
    <>
      <InlineTransparentLink noMargin noPadding onClick={() => setModalOpen(true)} lang={lang}>
        {checkDataLang(project.name)}
      </InlineTransparentLink>

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false)
        }}
        customStyles={customStyles}
        contentLabel="Project"
      >
        <h2>
          <Translate content="dataset.project.project" />
        </h2>

        <ProjectForm
          close={() => {
            setModalOpen(false)
          }}
          project={project}
          lang={lang}
        />
      </Modal>
    </>
  )
}

Project.propTypes = {
  project: PropTypes.object.isRequired,
}

const InlineTransparentLink = styled(TransparentLink)`
  display: inline;
`

const customStyles = {
  content: {
    minWidth: '20vw',
    maxWidth: '60vw',
    padding: '2vw',
  },
}

export default Project
