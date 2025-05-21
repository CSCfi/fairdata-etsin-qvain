import { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { action } from 'mobx'
import Select from 'react-select'
import Translate from '@/utils/Translate'
import {
  FieldWrapper,
  FieldInput,
  FieldGroup,
  Title,
  InfoText,
} from '@/components/qvain/general/V2'
import {
  onChange,
  getOptionLabel,
  getOptionValue,
  optionsToModels,
  getCurrentOption,
} from '@/components/qvain/utils/select'
import { UseCategory, FileType } from '@/stores/view/qvain/qvain.externalResources'
import { useStores } from '@/stores/stores'
import AbortClient from '@/utils/AbortClient'

export const ExternalFileFormBase = () => {
  const {
    Qvain: {
      readonly,
      ExternalResources: { inEdit: externalResource, setUseCategory, setFileType },
      ReferenceData: { getOptions },
    },
    Locale: { lang },
  } = useStores()

  const [useCategoryOptions, setUseCategoryOptions] = useState([])
  const [useFileTypeOptions, setFileTypeOptions] = useState([])

  useEffect(() => {
    const client = new AbortClient()
    getOptions('use_category', { client })
      .then(opts => optionsToModels(UseCategory, opts))
      .then(opts => setUseCategoryOptions(opts))
    getOptions('file_type', { client })
      .then(opts => optionsToModels(FileType, opts))
      .then(opts => setFileTypeOptions(opts))

    return () => {
      client.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <FieldGroup>
        <Title htmlFor="externalResourceTitleInput">
          <Translate content="qvain.files.external.form.title.label" /> *
        </Title>
        <Translate
          component={FieldInput}
          type="text"
          id="externalResourceTitleInput"
          value={externalResource.title}
          onChange={action(event => {
            externalResource.title = event.target.value
          })}
          attributes={{ placeholder: 'qvain.files.external.form.title.placeholder' }}
        />
      </FieldGroup>
      <FieldGroup>
        <Title htmlFor="useCategoryInput">
          <Translate content="qvain.files.external.form.useCategory.label" /> *
        </Title>
        <Translate
          component={Select}
          inputId="externalFileUseCategory"
          name="useCategory"
          options={useCategoryOptions}
          clearable
          isDisabled={readonly}
          value={getCurrentOption(UseCategory, useCategoryOptions, externalResource.useCategory)}
          onChange={val => onChange(setUseCategory)(val)}
          getOptionLabel={getOptionLabel(UseCategory, lang)}
          getOptionValue={getOptionValue(UseCategory)}
          attributes={{
            placeholder: 'qvain.files.external.form.useCategory.placeholder',
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <Title htmlFor="fileTypeInput">
          <Translate content="qvain.files.external.form.fileType.label" />
        </Title>
        <Translate
          component={Select}
          inputId="fileTypeInput"
          name="fileType"
          options={useFileTypeOptions}
          clearable
          isDisabled={readonly}
          value={getCurrentOption(FileType, useFileTypeOptions, externalResource.fileType)}
          onChange={val => onChange(setFileType)(val)}
          getOptionLabel={getOptionLabel(FileType, lang)}
          getOptionValue={getOptionValue(FileType)}
          attributes={{
            placeholder: 'qvain.files.external.form.fileType.placeholder',
          }}
        />
      </FieldGroup>

      <FieldGroup>
        <FieldWrapper>
          <Title htmlFor="accessUrlInput">
            <Translate content="qvain.files.external.form.accessUrl.label" />
          </Title>
          <Translate
            component={FieldInput}
            type="text"
            id="accessUrlInput"
            value={externalResource.accessUrl}
            onChange={action(event => {
              externalResource.accessUrl = event.target.value
            })}
            attributes={{ placeholder: 'qvain.files.external.form.accessUrl.placeholder' }}
          />
        </FieldWrapper>
        <Translate component={InfoText} content="qvain.files.external.form.accessUrl.infoText" />
      </FieldGroup>
      <FieldGroup>
        <FieldWrapper>
          <Title htmlFor="downloadUrlInput">
            <Translate content="qvain.files.external.form.downloadUrl.label" />
          </Title>
          <Translate
            component={FieldInput}
            type="text"
            id="downloadUrlInput"
            value={externalResource.downloadUrl}
            onChange={action(event => {
              externalResource.downloadUrl = event.target.value
            })}
            attributes={{ placeholder: 'qvain.files.external.form.downloadUrl.placeholder' }}
          />
        </FieldWrapper>
        <Translate component={InfoText} content="qvain.files.external.form.downloadUrl.infoText" />
      </FieldGroup>
    </>
  )
}

export default observer(ExternalFileFormBase)
