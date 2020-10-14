import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Translate from 'react-translate-component'
import styled from 'styled-components'

import { SaveButton, CancelButton } from '../../../general/buttons'
import { Label, Input, Textarea, CustomSelect } from '../../../general/modal/form'
import { Container } from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { getLocalizedOptions } from '../../../utils/getReferenceData'
import {
  fileSchema,
  fileTitleSchema,
  fileDescriptionSchema,
  fileUseCategorySchema,
} from '../../../utils/formValidation'
import { useStores } from '../../../utils/stores'

const FileForm = ({ className, setChanged, requestClose }) => {
  const {
    Qvain: {
      Files: { inEdit, applyInEdit },
      readonly,
    },
    Locale: { lang },
  } = useStores()

  const [fileTypesEn, setFileTypesEn] = useState([])
  const [fileTypesFi, setFileTypesFi] = useState([])
  const [useCategoriesEn, setUseCategoriesEn] = useState([])
  const [useCategoriesFi, setUseCategoriesFi] = useState([])
  const [title, setTitle] = useState(inEdit.title || inEdit.name)
  const [description, setDescription] = useState(inEdit.description)
  const [useCategory, setUseCategory] = useState()
  const [fileType, setFileType] = useState()
  const [fileError, setFileError] = useState()
  const [titleError, setTitleError] = useState()
  const [descriptionError, setDescriptionError] = useState()
  const [useCategoryError, setUseCategoryError] = useState()

  useEffect(() => {
    getLocalizedOptions('file_type').then(translations => {
      setFileTypesEn(translations.en)
      setFileTypesFi(translations.fi)
      setFileType(translations[lang].find(opt => opt.value === inEdit.fileType))
    })

    getLocalizedOptions('use_category').then(translations => {
      setUseCategoriesEn(translations.en)
      setUseCategoriesFi(translations.fi)
      setUseCategory(getUseCategory(translations.fi, translations.en, lang, inEdit))
    })
  })

  const handleCancel = event => {
    event.preventDefault()
    requestClose()
  }

  const handleChangeUse = selectedOption => {
    setUseCategory(selectedOption)
    setUseCategoryError(undefined)
    setChanged(true)
  }

  const handleChangeFileType = selectedOption => {
    setFileType(selectedOption)
    setChanged(true)
  }

  const handleSave = event => {
    event.preventDefault()
    const validationObj = {
      title,
      description,
      useCategory,
      fileType,
    }
    fileSchema
      .validate(validationObj)
      .then(() => {
        setFileError(undefined)
        setUseCategoryError(undefined)

        applyInEdit({
          title,
          description,
          useCategory: useCategory.value,
          fileType: (fileType && fileType.value) || undefined,
        })
      })
      .catch(err => {
        setFileError(err.errors)
      })
  }

  const handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value)
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  const handleTitleBlur = () => {
    handleOnBlur(fileTitleSchema, title, setTitleError)
  }

  const handleDescriptionBlur = () => {
    handleOnBlur(fileDescriptionSchema, description, setDescriptionError)
  }

  const handleUseCategoryBlur = () => {
    handleOnBlur(
      fileUseCategorySchema,
      useCategory ? useCategory.value : undefined,
      setUseCategoryError
    )
  }

  return (
    <FileContainer className={className}>
      <Translate
        component={Label}
        disabled={readonly}
        style={{ textTransform: 'uppercase' }}
        content="qvain.files.selected.form.identifier.label"
      />
      <p style={{ marginLeft: '10px' }}>{inEdit.identifier}</p>

      <Label>
        <Translate content="qvain.files.selected.form.title.label" /> *
      </Label>
      <Translate
        component={Input}
        value={title}
        disabled={readonly}
        onChange={event => {
          setTitle(event.target.value)
          setChanged(true)
        }}
        onBlur={handleTitleBlur}
        attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
      />
      {titleError !== undefined && <ValidationError>{titleError}</ValidationError>}
      <Label>
        <Translate content="qvain.files.selected.form.description.label" /> *
      </Label>
      <Translate
        component={Textarea}
        value={description}
        disabled={readonly}
        onChange={event => {
          setDescription(event.target.value)
          setChanged(true)
        }}
        onBlur={handleDescriptionBlur}
        attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
      />
      {descriptionError && <ValidationError>{descriptionError}</ValidationError>}
      <Row>
        <div>
          <Label>
            <Translate content="qvain.files.selected.form.use.label" /> *
          </Label>
          <Translate
            component={CustomSelect}
            value={useCategory}
            isDisabled={readonly}
            options={lang === 'en' ? useCategoriesEn : useCategoriesFi}
            onChange={handleChangeUse}
            onBlur={handleUseCategoryBlur}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
          />
          {useCategoryError && <ValidationError>{useCategoryError}</ValidationError>}
        </div>
        <div>
          <Label>
            <Translate component={Label} content="qvain.files.selected.form.fileType.label" />
          </Label>
          <Translate
            component={CustomSelect}
            value={fileType}
            isDisabled={readonly}
            onChange={handleChangeFileType}
            options={lang === 'en' ? fileTypesEn : fileTypesFi}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
          />
        </div>
      </Row>

      {fileError && <ValidationError>{fileError}</ValidationError>}
      <Buttons>
        <Translate component={CancelButton} onClick={handleCancel} content="qvain.common.cancel" />
        <Translate
          component={SaveButton}
          disabled={readonly}
          onClick={handleSave}
          content="qvain.common.save"
        />
      </Buttons>
    </FileContainer>
  )
}

FileForm.propTypes = {
  className: PropTypes.string,
  setChanged: PropTypes.func.isRequired,
  requestClose: PropTypes.func.isRequired,
}

FileForm.defaultProps = {
  className: '',
}

const getUseCategory = (fi, en, lang, inEdit) => {
  let uc
  if (lang === 'en') {
    uc = en.find(opt => opt.value === inEdit.useCategory)
  } else {
    uc = fi.find(opt => opt.value === inEdit.useCategory)
  }
  return uc
}

const FileContainer = styled(Container)`
  border: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
`

const Buttons = styled.div`
  display: flex;
  flex-wrap: wrap;
  * {
    margin: 0.25rem;
    flex-grow: 1;
  }
  margin: -0.25rem;
`

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.5rem;
`

export default observer(FileForm)
