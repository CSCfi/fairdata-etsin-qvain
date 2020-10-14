import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import { SaveButton, CancelButton } from '../../../general/buttons'
import { Label, CustomSelect, Input, Textarea } from '../../../general/modal/form'
import { Container } from '../../../general/card'
import ValidationError from '../../../general/errors/validationError'
import { getLocalizedOptions } from '../../../utils/getReferenceData'
import {
  directorySchema,
  directoryTitleSchema,
  directoryDescriptionSchema,
  directoryUseCategorySchema,
} from '../../../utils/formValidation'
import { useStores } from '../../../utils/stores'

export const DirectoryFormBase = ({ className, setChanged, requestClose }) => {
  const {
    Locale: { lang },
    Qvain: {
      Files: { inEdit, applyInEdit },
      readonly,
    },
  } = useStores()

  const [title, setTitle] = useState(inEdit.title || inEdit.name)
  const [description, setDescription] = useState(inEdit.description)
  const [useCategoriesEn, setUseCategoriesEn] = useState([])
  const [useCategoriesFi, setUseCategoriesFi] = useState([])
  const [useCategory, setUseCategory] = useState()
  const [directoryError, setDirectoryError] = useState()
  const [titleError, setTitleError] = useState()
  const [descriptionError, setDescriptionError] = useState()
  const [useCategoryError, setUseCategoryError] = useState()

  useEffect(() => {
    getLocalizedOptions('use_category').then(translations => {
      setUseCategoriesEn(translations.en)
      setUseCategoriesFi(translations.fi)
      setUseCategory(
        lang === 'en'
          ? getUseCategory(inEdit, translations.en)
          : getUseCategory(inEdit, translations.fi)
      )
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

  const handleSave = event => {
    event.preventDefault()
    const validationObj = {
      title,
      description,
      useCategory,
    }
    directorySchema
      .validate(validationObj)
      .then(() => {
        setDirectoryError(null)
        setUseCategoryError(null)
        applyInEdit({
          title,
          description,
          useCategory: useCategory.value,
        })
      })
      .catch(err => {
        setDirectoryError(err.errors)
      })
  }

  const handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value)
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  const handleTitleBlur = () => {
    handleOnBlur(directoryTitleSchema, title, setTitleError)
  }

  const handleDescriptionBlur = () => {
    handleOnBlur(directoryDescriptionSchema, description, setDescriptionError)
  }

  const handleOnUseCategoryBlur = () => {
    directoryUseCategorySchema
      .validate(useCategory)
      .then(() => {
        setUseCategoryError(undefined)
        setDirectoryError(undefined)
      })
      .catch(err => {
        setUseCategoryError(err.errors)
      })
  }

  return (
    <DirectoryContainer className={className}>
      <Label>
        <Translate content="qvain.files.selected.form.title.label" /> *
      </Label>
      <Translate
        component={Input}
        value={title}
        disabled={readonly}
        onChange={event => setTitle(event.target.value)}
        onBlur={handleTitleBlur}
        attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
      />
      {titleError !== undefined && <ValidationError>{titleError}</ValidationError>}
      <Label>
        <Translate content="qvain.files.selected.form.description.label" />
      </Label>
      <Translate
        component={Textarea}
        value={description}
        disabled={readonly}
        onChange={event => setDescription(event.target.value)}
        onBlur={handleDescriptionBlur}
        attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
      />
      {descriptionError !== undefined && <ValidationError>{descriptionError}</ValidationError>}
      <Label>
        <Translate content="qvain.files.selected.form.use.label" /> *
      </Label>
      <Translate
        component={CustomSelect}
        value={useCategory}
        isDisabled={readonly}
        options={lang === 'en' ? useCategoriesEn : useCategoriesFi}
        onChange={handleChangeUse}
        onBlur={handleOnUseCategoryBlur}
        menuPlacement="auto"
        menuPosition="fixed"
        menuShouldScrollIntoView={false}
        attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
      />
      {useCategoryError !== undefined && <ValidationError>{useCategoryError}</ValidationError>}
      {directoryError !== undefined && <ValidationError>{directoryError}</ValidationError>}
      <Buttons>
        <Translate component={CancelButton} onClick={handleCancel} content="qvain.common.cancel" />
        <Translate
          component={SaveButton}
          disabled={readonly}
          onClick={handleSave}
          content="qvain.common.save"
        />
      </Buttons>
    </DirectoryContainer>
  )
}

DirectoryFormBase.propTypes = {
  className: PropTypes.string,
  setChanged: PropTypes.func.isRequired,
  requestClose: PropTypes.func.isRequired,
}

DirectoryFormBase.defaultProps = {
  className: '',
}

const DirectoryContainer = styled(Container)`
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

const getUseCategory = (directory, translations) =>
  translations.find(opt => opt.value === directory.useCategory)

export default observer(DirectoryFormBase)
