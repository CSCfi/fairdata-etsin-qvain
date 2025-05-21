import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Translate from '@/utils/Translate'

import Modal from '@/components/general/modal'
import { TransparentLink } from '@/components/etsin/general/button'

import ProjectForm from './projectForm'
import { useStores } from '@/stores/stores'

const Project = ({ project }) => {
  const {
    Locale: { getPreferredLang, getValueTranslation },
  } = useStores()

  const [modalOpen, setModalOpen] = useState(false)

  const lang = getPreferredLang(project.title)

  return (
    <>
      <InlineTransparentLink noMargin noPadding onClick={() => setModalOpen(true)} lang={lang}>
        {getValueTranslation(project.title)}
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
          <Translate content="dataset.project.project_title" />
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
