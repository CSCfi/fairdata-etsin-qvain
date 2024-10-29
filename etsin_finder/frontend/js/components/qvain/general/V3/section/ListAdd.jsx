import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Translate from 'react-translate-component'

import { useStores } from '@/stores/stores'
import Button from '@/components/general/button'

const ListAdd = ({ model, alignment }) => {
  const {
    Qvain: { readonly },
  } = useStores()

  const {
    controller: { create },
    translationPath,
  } = model

  return (
    <ButtonContainer alignment={alignment}>
      <AddNewButton type="button" onClick={create} disabled={readonly}>
        <Translate content={`${translationPath}.modal.addButton`} />
      </AddNewButton>
    </ButtonContainer>
  )
}

ListAdd.propTypes = {
  model: PropTypes.object.isRequired,
  alignment: PropTypes.string,
}

ListAdd.defaultProps = {
  alignment: 'left',
}

const ButtonContainer = styled.div`
  text-align: ${props => props.alignment};
  margin-top: 0.5rem;
  margin-bottom: 0;
  > button {
    margin: 0;
  }
`
const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 0.2em;
  margin-bottom: 0.4em;
`

export default ListAdd
