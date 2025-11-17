import { InfoTextLarge, TitleSmall } from '@/components/qvain/general/V3'
import Translate from '@/utils/Translate'
import { FormField, RadioInput, Label } from '@/components/qvain/general/modal/form'
import { useStores } from '@/stores/stores'
import { observer } from 'mobx-react'
function ShowDataDetails() {
  const {
    Qvain: { showFileMetadata, setShowFileMetadata, readonly },
  } = useStores()

  return (
    <>
      <Translate
        component={TitleSmall}
        content="qvain.rightsAndLicenses.accessType.showDataDetailsTitle"
      />
      <Translate
        component={InfoTextLarge}
        content="qvain.rightsAndLicenses.accessType.showDataDetailsInfo"
      />
      <FormField>
        <RadioInput
          id="show-file-metadata-no"
          name="show-file-metadata"
          onChange={() => setShowFileMetadata(false)}
          type="radio"
          checked={showFileMetadata === false}
          disabled={readonly}
        />
        <Label htmlFor="show-file-metadata-no">
          <Translate content="qvain.rightsAndLicenses.accessType.showDataDetails.radio.no" />
        </Label>
      </FormField>
      <FormField>
        <RadioInput
          id="show-file-metadata-yes"
          name="show-file-metadata"
          onChange={() => setShowFileMetadata(true)}
          type="radio"
          checked={showFileMetadata === true}
          disabled={readonly}
        />
        <Label htmlFor="show-file-metadata-yes">
          <Translate content="qvain.rightsAndLicenses.accessType.showDataDetails.radio.yes" />
        </Label>
      </FormField>
    </>
  )
}

export default observer(ShowDataDetails)
