import React from 'react'
import { observer } from 'mobx-react'
import Translate from '@/utils/Translate'
import { useStores } from '@/stores/stores'
import ValidationError from '@/components/qvain/general/errors/validationError'
import { ButtonContainer, AddNewButton } from '@/components/qvain/general/buttons'
import TemporalList from './TemporalList'
import { SectionContentWrapper } from '../../general/V2/Section'
import { InfoTextLarge } from '@/components/qvain/general/V2'
import DurationPicker from '@/components/qvain/general/V2/Durationpicker'

const TemporalFieldContent = () => {
  const {
    Qvain,
    Locale: { lang },
  } = useStores()

  const Field = Qvain.Temporals
  const { validationError, translationsRoot, storage, removeTemporal, readonly } = Field
  return (
    <SectionContentWrapper>
      <Translate component={InfoTextLarge} content={`${translationsRoot}.infoText`} />
      <TemporalList lang={lang} temporals={storage} remove={removeTemporal} readonly={readonly} />
      <DurationPicker Field={Field} datum="duration" id="temporal-period" />
      {validationError && <ValidationError>{validationError}</ValidationError>}
      <ButtonContainer>
        <Translate
          component={AddNewButton}
          content={`${translationsRoot}.addButton`}
          onClick={Field.validateAndSave}
          disabled={readonly}
        />
      </ButtonContainer>
    </SectionContentWrapper>
  )
}

export default observer(TemporalFieldContent)
