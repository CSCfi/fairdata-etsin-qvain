import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
import DurationPicker from '../../general/durationpicker'
import { ButtonContainer, AddNewButton } from '../../general/addButton'
import TemporalList from './TemporalList'

const translationsRoot = 'qvain.temporalAndSpatial.temporal'

const TemporalFieldContent = ({ Store, lang }) => {
  const Field = Store.Temporals

  const handleClick = () => {
    Store.addToField('temporals', Field.inEdit)
    Field.create()
  }

  return (
    <>
      <Observer>{() => <TemporalList lang={lang} temporals={Store.temporals} remove={(uiid) => Store.removeItemInField('temporals', uiid)} />}</Observer>
      <DurationPicker Store={Store} Field={Field} translationsRoot={translationsRoot} datum="duration" />
      <ButtonContainer>
        <Translate component={AddNewButton} content={`${translationsRoot}.addButton`} onClick={handleClick} />
      </ButtonContainer>
    </>
  )
}


TemporalFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired
}

export default TemporalFieldContent
