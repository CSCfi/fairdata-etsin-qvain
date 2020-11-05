import React, { useState, useEffect, Fragment } from 'react'
import { observer } from 'mobx-react'
import { toJS, action } from 'mobx'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { Input, Label, CustomSelect } from '../../../general/modal/form'
import { SaveButton, CancelButton, FileItem } from '../../../general/buttons'
import ValidationError from '../../../general/errors/validationError'
import { externalResourceSchema } from '../../../utils/formValidation'
import { getLocalizedOptions } from '../../../utils/getReferenceData'
import { EmptyExternalResource } from '../../../../../stores/view/qvain'
import { useStores } from '../../../utils/stores'

export const ExternalFileFormBase = () => {
  const {
    Qvain: {
      externalResourceInEdit: externalResource,
      idaPickerOpen,
      setIdaPickerOpen,
      saveExternalResource,
      editExternalResource,
    },
    Locale: { lang },
  } = useStores()
  const [useCategories, setUseCategories] = useState({ en: [], fi: [] })
  const [error, setError] = useState(null)

  useEffect(() => {
    getLocalizedOptions('use_category').then(translations => {
      setUseCategories({
        en: translations.en,
        fi: translations.fi,
      })
    })
  }, [])

  const handleSaveExternalResource = event => {
    event.preventDefault()
    const externalResourceJs = toJS(externalResource)
    externalResourceSchema
      .validate(externalResourceJs)
      .then(() => {
        saveExternalResource(externalResource)
        editExternalResource(EmptyExternalResource)
        setError(undefined)

        // Close IDA picker if it is open since after adding an externalResources,
        // user shouldn't be able to add IDA files or directories
        if (idaPickerOpen) {
          setIdaPickerOpen(false)
        }
      })
      .catch(err => {
        setError(err.errors)
      })
  }

  const handleCancel = event => {
    event.preventDefault()
    editExternalResource(EmptyExternalResource)
    setError(null)
  }

  return (
    <Fragment>
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
        inputId="useCategoryInput"
        value={externalResource.useCategory}
        options={useCategories[lang]}
        onChange={action(selection => {
          externalResource.useCategory = selection
        })}
        attributes={{ placeholder: 'qvain.files.external.form.useCategory.placeholder' }}
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
    </Fragment>
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
