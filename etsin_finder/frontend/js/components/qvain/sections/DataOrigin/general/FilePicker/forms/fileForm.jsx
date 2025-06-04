import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { CancelButton, SaveButton } from '@/components/qvain/general/buttons'
import { ValidationErrors } from '@/components/qvain/general/errors/validationError'
import { CustomSelect, Input, Label } from '@/components/qvain/general/modal/form'
import { TextArea } from '@/components/qvain/general/V3'
import { useStores } from '@/utils/stores'
import useReferenceData from '@/utils/useReferenceData'
import { Buttons, FileContainer } from './styles'

const FileForm = ({ setChanged, requestClose }) => {
  const Stores = useStores()
  const {
    Locale: { translate, getValueTranslation },
    Qvain: {
      readonly,
      Files: { inEdit, fileDescriptionSchema, fileUseCategorySchema, fileTitleSchema },
    },
  } = Stores
  const { options: fileTypeOptions, isLoading: isLoadingFileType } = useReferenceData('file_type')
  const { options: useCategoryOptions, isLoading: isLoadingUseCategory } =
    useReferenceData('use_category')

  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [fileType, setFileType] = useState()
  const [useCategory, setUseCategory] = useState()

  const [fileError, setFileError] = useState()
  const [descriptionError, setDescriptionError] = useState()
  const [titleError, setTitleError] = useState()
  const [useCategoryError, setUseCategoryError] = useState()

  useEffect(() => {
    const file = inEdit || {}
    setTitle(file.title || file.name)
    setDescription(file.description)
    setFileType(file.fileType)
    setUseCategory(file.useCategory)

    setTitleError(undefined)
    setDescriptionError(undefined)
    setUseCategoryError(undefined)
    setFileError(undefined)
  }, [inEdit])

  const handleCancel = event => {
    event.preventDefault()
    requestClose()
  }

  const updateTitle = value => {
    setTitle(value)
    setChanged(true)
  }

  const updateDescription = value => {
    setDescription(value)
    setChanged(true)
  }

  const handleChangeUse = selectedOption => {
    setUseCategory(selectedOption.value)
    setUseCategoryError(undefined)
    setChanged(true)
  }

  const handleChangeFileType = selectedOption => {
    setFileType(selectedOption.value)
    setChanged(true)
  }

  const handleSave = async event => {
    event.preventDefault()
    const validationObj = {
      title,
      description,
      useCategory,
      fileType,
    }
    const { fileSchema, applyInEdit } = Stores.Qvain.Files

    try {
      await fileSchema.validate(validationObj, { strict: true })
      setFileError(undefined)
      setUseCategoryError(undefined)
      applyInEdit({
        title,
        description,
        useCategory: useCategory,
        fileType: fileType,
      })
    } catch (err) {
      setFileError(err.errors)
    }
  }

  const handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value, { strict: true })
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
    handleOnBlur(fileUseCategorySchema, useCategory, setUseCategoryError)
  }

  if (!inEdit) {
    return null
  }

  const getOptionLabel = option => getValueTranslation(option.label)

  return (
    <FileContainer>
      <Label disabled={readonly} style={{ textTransform: 'uppercase' }}>
        {translate('qvain.files.selected.form.identifier.label')}
      </Label>
      <p style={{ marginLeft: '10px' }}>{inEdit.identifier}</p>
      <Label htmlFor="file-form-title">
        {translate('qvain.files.selected.form.title.label')} *
      </Label>
      <Input
        value={title || ''}
        disabled={readonly}
        onChange={event => updateTitle(event.target.value)}
        onBlur={handleTitleBlur}
        placeholder={translate('qvain.files.selected.form.title.placeholder')}
        id="file-form-title"
      />
      {titleError !== undefined && <ValidationErrors errors={titleError} />}
      <Label htmlFor="file-form-description">
        {translate('qvain.files.selected.form.description.label')}
      </Label>
      <TextArea
        value={description || ''}
        disabled={readonly}
        onChange={event => updateDescription(event.target.value)}
        onBlur={handleDescriptionBlur}
        placeholder={translate('qvain.files.selected.form.description.placeholder')}
        id="file-form-description"
      />
      {descriptionError !== undefined && <ValidationErrors errors={descriptionError} />}
      <Row>
        <div>
          <Label htmlFor="file-form-use-category">
            {translate('qvain.files.selected.form.use.label')} *
          </Label>
          <CustomSelect
            component={CustomSelect}
            value={useCategoryOptions.find(opt => opt.value == useCategory) || ''}
            isDisabled={readonly}
            options={useCategoryOptions}
            isLoading={isLoadingUseCategory}
            onChange={handleChangeUse}
            onBlur={handleUseCategoryBlur}
            getOptionLabel={getOptionLabel}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            placeholder={translate('qvain.files.selected.form.use.placeholder')}
            inputId="file-form-use-category"
          />
          {useCategoryError !== undefined && <ValidationErrors errors={useCategoryError} />}
        </div>
        <div>
          <Label htmlFor="file-form-file-type">
            {translate('qvain.files.selected.form.fileType.label')}
          </Label>
          <CustomSelect
            value={fileTypeOptions.find(opt => opt.value == fileType) || ''}
            isClearable
            isDisabled={readonly}
            onChange={handleChangeFileType}
            options={fileTypeOptions}
            isLoading={isLoadingFileType}
            getOptionLabel={getOptionLabel}
            menuPlacement="auto"
            menuPosition="fixed"
            menuShouldScrollIntoView={false}
            placeholder={translate('qvain.files.selected.form.fileType.placeholder')}
            inputId="file-form-file-type"
          />
        </div>
      </Row>
      {fileError !== undefined && <ValidationErrors errors={fileError} />}
      <Buttons>
        <CancelButton onClick={handleCancel}>{translate('qvain.common.cancel')}</CancelButton>
        <SaveButton disabled={readonly} onClick={handleSave}>
          {translate('qvain.common.save')}
        </SaveButton>
      </Buttons>
    </FileContainer>
  )
}

FileForm.propTypes = {
  setChanged: PropTypes.func.isRequired,
  requestClose: PropTypes.func.isRequired,
}

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 0.5rem;
`

export default observer(FileForm)
