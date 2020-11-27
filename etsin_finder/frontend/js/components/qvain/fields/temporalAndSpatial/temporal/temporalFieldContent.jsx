import React from 'react'
import PropTypes from 'prop-types'
import Translate from 'react-translate-component'
import { Observer } from 'mobx-react'
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
      <Observer>
        {() => (
          <TemporalList
            lang={lang}
            temporals={Field.storage}
            remove={uiid => Field.removeTemporal(uiid)}
            readonly={Field.readonly}
          />
        )}
      </Observer>
      <DurationPicker
        Store={Store}
        Field={Field}
        translationsRoot={translationsRoot}
        datum="duration"
        id="temporal-period"
      />
      <Observer>
        {() => (
          <>
            <Translate component={ValidationError} content={Field.validationError} />
            <ButtonContainer>
              <Translate
                component={AddNewButton}
                content={`${translationsRoot}.addButton`}
                onClick={handleClick}
                disabled={Field.readonly}
              />
            </ButtonContainer>
          </>
        )}
      </Observer>
    </>
  )
}

TemporalFieldContent.propTypes = {
  Store: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default TemporalFieldContent
