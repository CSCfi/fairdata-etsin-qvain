import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import DurationPicker from '../../../general/input/durationpicker'
import ValidationError from '../../../general/errors/validationError'
import { ButtonContainer, AddNewButton } from '../../../general/buttons'
import TemporalList from './TemporalList'
import handleSave from './handleSave'

const translationsRoot = 'qvain.temporalAndSpatial.temporal'

const TemporalFieldContent = ({ Store, lang }) => {
  const Field = Store.Temporals

  const handleClick = () => {
    handleSave(Store, Field)
  }

  return (
    <>
      <TemporalList
        lang={lang}
        temporals={Field.storage}
        remove={uiid => Field.removeTemporal(uiid)}
        readonly={Field.readonly}
      />
      <DurationPicker
        Store={Store}
        Field={Field}
        translationsRoot={translationsRoot}
        datum="duration"
        id="temporal-period"
      />
      {Field.validationError && <ValidationError>{Field.validationError}</ValidationError>}
      <ButtonContainer>
        <Translate
          component={AddNewButton}
          content={`${translationsRoot}.addButton`}
          onClick={handleClick}
          disabled={Field.readonly}
        />
      </ButtonContainer>
    </>
  )
}

TemporalFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default observer(TemporalFieldContent)
