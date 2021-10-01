import React from 'react'
import Translate from 'react-translate-component'
import { observer } from 'mobx-react'
import { useStores } from '@/stores/stores'
import DurationPicker from '../../../general/input/durationpicker'
import ValidationError from '../../../general/errors/validationError'
import { ButtonContainer, AddNewButton } from '../../../general/buttons'
import TemporalList from './TemporalList'
import handleSave from './handleSave'

const TemporalFieldContent = () => {
  const {
    Qvain,
    Locale: { lang },
  } = useStores()

  const Field = Qvain.Temporals
  const { validationError, translationsRoot, storage, removeTemporal, readonly } = Field

  const handleClick = () => {
    handleSave(Qvain, Field)
  }

  return (
    <>
      <TemporalList lang={lang} temporals={storage} remove={removeTemporal} readonly={readonly} />
      <DurationPicker Field={Field} datum="duration" id="temporal-period" />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <ButtonContainer>
        <Translate
          component={AddNewButton}
          content={`${translationsRoot}.addButton`}
          onClick={handleClick}
          disabled={readonly}
        />
      </ButtonContainer>
    </>
  )
}

export default observer(TemporalFieldContent)
