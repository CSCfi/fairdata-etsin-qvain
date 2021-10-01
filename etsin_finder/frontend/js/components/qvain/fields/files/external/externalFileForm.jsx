import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react'
import { toJS, action } from 'mobx'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Input, Label, CustomSelect } from '../../../general/modal/form'
import { SaveButton, CancelButton, FileItem } from '../../../general/buttons'
import ValidationError from '../../../general/errors/validationError'
import {
  onChange,
  getCurrentOption,
  getOptionLabel,
  getOptionValue,
  getAllOptions,
} from '../../../utils/select'
import { UseCategory } from '../../../../../stores/view/qvain/qvain.externalResources'
import { externalResourceSchema } from '../../../../../stores/view/qvain/qvain.dataCatalog.schemas'
import { useStores } from '../../../utils/stores'

export const ExternalFileFormBase = () => {
  const {
    Qvain: {
      readonly,
      ExternalResources: { save, clearInEdit, inEdit: externalResource, setUseCategory },
    },
    Locale: { lang },
  } = useStores()
  const [useCategoryOptions, setUseCategoryOptions] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllOptions(UseCategory, 'use_category').then(opts => setUseCategoryOptions(opts))
  }, [])

  const handleSaveExternalResource = event => {
    event.preventDefault()
    const externalResourceJs = toJS(externalResource)
    externalResourceSchema
      .validate(externalResourceJs, { strict: true })
      .then(() => {
        save(externalResource)
        clearInEdit()
        setError(undefined)
      })
      .catch(err => {
        setError(err.errors)
      })
  }

  const handleCancel = event => {
    event.preventDefault()
    clearInEdit()
    setError(null)
  }

  return (
    <>
      <Label htmlFor="externalResourceTitleInput">
        <Translate content="qvain.files.external.form.title.label" /> *
      </Label>
      <Translate
        component={ResourceInput}
        type="text"
        id="externalResourceTitleInput"
        value={externalResource.title}
        onChange={action(event => {
          externalResource.title = event.target.value
        })}
        attributes={{ placeholder: 'qvain.files.external.form.title.placeholder' }}
      />
      <Label htmlFor="useCategoryInput">
        <Translate content="qvain.files.external.form.useCategory.label" /> *
      </Label>
      <Translate
        component={CustomSelect}
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
      <Label htmlFor="accessUrlInput">
        <Translate content="qvain.files.external.form.accessUrl.label" />
        <Translate component="p" content="qvain.files.external.form.accessUrl.infoText" />
      </Label>
      <Translate
        component={ResourceInput}
        type="text"
        id="accessUrlInput"
        value={externalResource.accessUrl}
        onChange={action(event => {
          externalResource.accessUrl = event.target.value
        })}
        attributes={{ placeholder: 'qvain.files.external.form.accessUrl.placeholder' }}
      />
      <Label htmlFor="downloadUrlInput">
        <Translate content="qvain.files.external.form.downloadUrl.label" />
        <Translate component="p" content="qvain.files.external.form.downloadUrl.infoText" />
      </Label>
      <Translate
        component={ResourceInput}
        type="text"
        id="downloadUrlInput"
        value={externalResource.downloadUrl}
        onChange={action(event => {
          externalResource.downloadUrl = event.target.value
        })}
        attributes={{ placeholder: 'qvain.files.external.form.downloadUrl.placeholder' }}
      />
      {error && <ValidationError>{error}</ValidationError>}
      <Translate
        component={CancelButton}
        onClick={handleCancel}
        content="qvain.files.external.form.cancel.label"
      />
      <Translate
        component={SaveButton}
        onClick={handleSaveExternalResource}
        content={'qvain.files.external.form.save.label'}
      />
    </>
  )
}

export const ResourceInput = styled(Input)`
  width: 100%;
`

export const ResourceSave = styled(SaveButton)`
  margin-left: 0;
`

export const ResourceItem = styled(FileItem)`
  margin-bottom: ${props => (props.active ? '0' : '10px')};
`

export default observer(ExternalFileFormBase)
