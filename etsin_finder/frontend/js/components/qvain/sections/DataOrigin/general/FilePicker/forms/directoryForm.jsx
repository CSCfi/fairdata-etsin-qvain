import Translate from '@/utils/Translate'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import Loader from '@/components/general/loader'
import { CancelButton, SaveButton } from '@/components/qvain/general/buttons'
import { ValidationErrors } from '@/components/qvain/general/errors/validationError'
import { Checkbox, CustomSelect, Input, Label } from '@/components/qvain/general/modal/form'
import { TextArea } from '@/components/qvain/general/V3'
import { useStores } from '@/stores/stores'
import useReferenceData from '@/utils/useReferenceData'
import { Buttons, DirectoryContainer } from './styles'

const DirectoryForm = ({ setChanged, requestClose }) => {
  const Stores = useStores()
  const {
    Locale: { translate, getValueTranslation },
    Qvain: {
      readonly,
      Files: {
        inEdit,
        directoryDescriptionSchema,
        directoryUseCategorySchema,
        directoryTitleSchema,
      },
    },
  } = Stores
  const { options: useCategoryOptions, isLoading: isLoadingUseCategory } =
    useReferenceData('use_category')

  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [useCategory, setUseCategory] = useState()

  const [directoryError, setDirectoryError] = useState()
  const [descriptionError, setDescriptionError] = useState()
  const [titleError, setTitleError] = useState()
  const [useCategoryError, setUseCategoryError] = useState()

  const [shouldApplyUseCategoryToChildren, setShouldApplyUseCategoryToChildren] = useState(false)
  const [applyingUseCategory, setApplyingUseCategory] = useState(false)

  useEffect(() => {
    const file = inEdit || {}
    setTitle(file.title || file.name)
    setDescription(file.description)
    setUseCategory(file.useCategory)
    setShouldApplyUseCategoryToChildren(false)

    setTitleError(undefined)
    setDescriptionError(undefined)
    setUseCategoryError(undefined)
    setDirectoryError(undefined)
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

  const handleSave = async event => {
    event.preventDefault()
    const validationObj = {
      title,
      description,
      useCategory,
    }
    const { directorySchema, applyInEdit } = Stores.Qvain.Files

    try {
      await directorySchema.validate(validationObj, { strict: true })
      setDirectoryError(undefined)
      setUseCategoryError(undefined)
      setApplyingUseCategory(shouldApplyUseCategoryToChildren)
      await applyInEdit(
        {
          title,
          description,
          useCategory: useCategory,
        },
        { applyToChildren: shouldApplyUseCategoryToChildren }
      )
      setChanged(false)
    } catch (err) {
      setDirectoryError(err.errors)
    } finally {
      setApplyingUseCategory(false)
    }
  }

  const handleOnBlur = (validator, value, errorSet) => {
    validator
      .validate(value, { strict: true })
      .then(() => errorSet(undefined))
      .catch(err => errorSet(err.errors))
  }

  const handleTitleBlur = () => {
    handleOnBlur(directoryTitleSchema, title, setTitleError)
  }

  const handleDescriptionBlur = () => {
    handleOnBlur(directoryDescriptionSchema, description, setDescriptionError)
  }

  const handleUseCategoryBlur = () => {
    handleOnBlur(directoryUseCategorySchema, useCategory, setUseCategoryError)
  }

  if (!inEdit) {
    return null
  }

  const getOptionLabel = option => getValueTranslation(option.label)

  const toggleShouldApplyUseCategoryToChildren = () => {
    setShouldApplyUseCategoryToChildren(!shouldApplyUseCategoryToChildren)
  }

  return (
    <DirectoryContainer>
      <Label htmlFor="directory-form-title">
        <Translate content="qvain.files.selected.form.title.label" /> *
      </Label>
      <Input
        value={title || ''}
        disabled={readonly}
        onChange={event => updateTitle(event.target.value)}
        onBlur={handleTitleBlur}
        placeholder={translate('qvain.files.selected.form.title.placeholder')}
        id="directory-form-title"
      />
      {titleError !== undefined && <ValidationErrors errors={titleError} />}
      <Label htmlFor="directory-form-description">
        <Translate content="qvain.files.selected.form.description.label" />
      </Label>
      <TextArea
        value={description || ''}
        disabled={readonly}
        onChange={event => updateDescription(event.target.value)}
        onBlur={handleDescriptionBlur}
        placeholder={translate('qvain.files.selected.form.description.placeholder')}
        id="directory-form-description"
      />
      {descriptionError !== undefined && <ValidationErrors errors={descriptionError} />}
      <Label htmlFor="directory-form-use-category">
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
        inputId="directory-form-use-category"
      />

      <CheckboxRow>
        <Checkbox
          id="applyToChildrenCheckbox"
          onChange={toggleShouldApplyUseCategoryToChildren}
          checked={shouldApplyUseCategoryToChildren}
          disabled={readonly}
        />
        <Translate
          content="qvain.files.selected.form.applyUseCategoryToChildren"
          component={CheckboxLabel}
          htmlFor="applyToChildrenCheckbox"
        />
        {applyingUseCategory && <Loader active size="1.1em" spinnerSize="3px" />}
      </CheckboxRow>

      {useCategoryError !== undefined && <ValidationErrors errors={useCategoryError} />}
      {directoryError !== undefined && <ValidationErrors errors={directoryError} />}
      <Buttons>
        <CancelButton onClick={handleCancel} disabled={applyingUseCategory}>
          {translate('qvain.common.cancel')}
        </CancelButton>
        <SaveButton disabled={readonly || applyingUseCategory} onClick={handleSave}>
          {translate('qvain.common.save')}
        </SaveButton>
      </Buttons>
    </DirectoryContainer>
  )
}

DirectoryForm.propTypes = {
  setChanged: PropTypes.func.isRequired,
  requestClose: PropTypes.func.isRequired,
}

const CheckboxRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: -0.5rem;
  margin-bottom: 1.25rem;
`

const CheckboxLabel = styled.label`
  margin-right: auto;
  padding-left: 4px;
  display: inline-block;
`

export default observer(DirectoryForm)
