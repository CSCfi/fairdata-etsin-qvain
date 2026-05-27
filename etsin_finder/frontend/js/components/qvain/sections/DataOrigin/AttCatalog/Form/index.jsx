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
import { UseCategory, FileType, DataService } from '@/stores/view/qvain/qvain.externalResources'
import { useStores } from '@/stores/stores'
import AbortClient from '@/utils/AbortClient'
import TranslationTab from '@/components/qvain/general/V3/tab/TranslationTab.v3'
import { DATA_CATALOG_IDENTIFIER } from '@/utils/constants'

export const ExternalFileFormBase = () => {
  const {
    Locale: { translate, lang },
    Qvain: {
      readonly,
      ExternalResources: {
        inEdit: externalResource,
        setUseCategory,
        setFileType,
        setDataService,
        setTitleTranslation,
      },
      ReferenceData: { getOptions },
      dataCatalogConfigs,
    },
  } = useStores()

  const [useCategoryOptions, setUseCategoryOptions] = useState([])
  const [fileTypeOptions, setFileTypeOptions] = useState([])
  const [dataServiceOptions, setDataServiceOptions] = useState([])

  // Title translation tab
  const [language, setLanguage] = useState(lang)

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

  useEffect(() => {
    const attConfig = dataCatalogConfigs[DATA_CATALOG_IDENTIFIER.ATT]
    const services = attConfig?.data_services || []
    const opts = services.map(service => DataService(service.pref_label, service.id))
    setDataServiceOptions(opts)
  }, [dataCatalogConfigs])

  return (
    <>
      <FieldGroup>
        <TranslationTab language={language} setLanguage={setLanguage}>
          <Title htmlFor="externalResourceTitleInput">
            {translate('qvain.files.external.form.title.label')}
          </Title>
          <FieldInput
            component={FieldInput}
            type="text"
            id="externalResourceTitleInput"
            value={externalResource.title[language] || ''}
            onChange={event => {
              setTitleTranslation(event.target.value, language)
            }}
            placeholder={translate('qvain.files.external.form.title.placeholder')}
          />
        </TranslationTab>
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
          options={fileTypeOptions}
          clearable
          isDisabled={readonly}
          value={getCurrentOption(FileType, fileTypeOptions, externalResource.fileType)}
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
          <Title htmlFor="fileSizeInput">
            <Translate content="qvain.files.external.form.fileSize.label" />
          </Title>
          <Translate
            component={FieldInput}
            type="text"
            id="fileSizeInput"
            value={externalResource.fileSize}
            onChange={action(event => {
              externalResource.fileSize = event.target.value
            })}
            attributes={{ placeholder: 'qvain.files.external.form.fileSize.placeholder' }}
          />
        </FieldWrapper>
        <Translate component={InfoText} content="qvain.files.external.form.fileSize.infoText" />
      </FieldGroup>
      {dataServiceOptions.length > 0 && (
        <FieldGroup>
          <Title htmlFor="dataServiceInput">
            <Translate content="qvain.files.daasCatalog.form.dataService.label" />
          </Title>
          <Translate
            component={Select}
            inputId="dataServiceInput"
            name="dataService"
            options={dataServiceOptions}
            clearable
            isDisabled={readonly}
            value={getCurrentOption(DataService, dataServiceOptions, externalResource.dataService)}
            onChange={val => onChange(setDataService)(val)}
            getOptionLabel={getOptionLabel(DataService, lang)}
            getOptionValue={getOptionValue(DataService)}
            attributes={{
              placeholder: 'qvain.files.daasCatalog.form.dataService.placeholder',
            }}
          />
        </FieldGroup>
      )}
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
