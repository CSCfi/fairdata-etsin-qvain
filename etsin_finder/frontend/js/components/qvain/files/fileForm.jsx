import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react'
import styled from 'styled-components';
import Translate from 'react-translate-component'
import {
  SaveButton,
  CancelButton
} from '../general/buttons'
import { Label, Input, Textarea, CustomSelect, Checkbox, FormField } from '../general/form'
import { Container } from '../general/card'
import getReferenceData, { getLocalizedOptions } from '../utils/getReferenceData';

class FileForm extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired
  }

  state = {
    fileTypesEn: [],
    fileTypesFi: [],
    useCategoriesEn: [],
    useCategoriesFi: [],
    fileFormats: [],
    formatVersions: new Map(),
    title: this.props.Stores.Qvain.inEdit.file_characteristics.title || 'Couldn\'t get title',
    description: this.props.Stores.Qvain.inEdit.file_characteristics.description || 'Couldn\'t get description',
    useCategory: undefined,
    fileType: undefined,
    fileFormat: undefined,
    formatVersion: undefined,
    isSequential: this.props.Stores.Qvain.inEdit.file_characteristics.csv_record_separator !== undefined,
    csvDelimiter: delimiters.find(d => d.value === 'comma'),
    csvHasHeader: true,
    csvRecordSeparator: { value: 'lf', label: 'LF' },
    csvQuoteChar: '\\',
    csvEncoding: encodingType.find(e => e.value === 'utf-8')
  }

  componentDidMount = () => {
    getLocalizedOptions('file_type').then(translations => {
      this.setState({
        fileTypesEn: translations.en,
        fileTypesFi: translations.fi,
        fileType: translations.en.find(opt =>
          opt.value === this.props.Stores.Qvain.inEdit.file_characteristics.file_type
        )
      })
    })
    getLocalizedOptions('use_category').then(translations => {
      this.setState({
        useCategoriesEn: translations.en,
        useCategoriesFi: translations.fi,
        useCategory: translations.en.find(opt =>
          opt.value === this.props.Stores.Qvain.inEdit.file_characteristics.use_category
        )
      })
    })
    getReferenceData('file_format_version').then(res => {
      const hits = res.data.hits.hits
      const refs = hits.map(hit => ({ value: hit._source.input_file_format, label: hit._source.input_file_format }))
      const formatVersions = new Map()
      hits.forEach(hit => {
        formatVersions.set(
          hit._source.input_file_format,
          [
            ...formatVersions.get(hit._source.input_file_format) || [],
            { value: hit._source.output_format_version, label: hit._source.output_format_version }
          ]
        )
      })
      console.log(formatVersions)
      const { inEdit } = this.props.Stores.Qvain
      this.setState({
        fileFormats: refs,
        fileFormat: refs.find(opt => opt.value === inEdit.file_characteristics.file_format),
        formatVersions,
        formatVersion: getFormatVersion(inEdit.file_characteristics.file_format, formatVersions)
      })
    })
  }

  handleCancel = (event) => {
    event.preventDefault()
    this.props.Stores.Qvain.setInEdit(undefined)
  }

  handleChangeUse = (selectedOption) => {
    this.setState({
      useCategory: selectedOption
    })
  }

  handleChangeFileType = (selectedOption) => {
    this.setState({
      fileType: selectedOption
    })
  }

  handleChangeFileFormat = (selectedOption) => {
    this.setState({
      fileFormat: selectedOption
    })
  }

  handleSave = (event) => {
    event.preventDefault()
    const fileCharacteristics = this.props.Stores.Qvain.inEdit.file_characteristics
    const {
      title,
      description,
      useCategory,
      fileType,
      fileFormat,
      formatVersion,
      isSequential,
      csvDelimiter,
      csvHasHeader,
      csvRecordSeparator,
      csvQuoteChar,
      csvEncoding
    } = this.state
    fileCharacteristics.title = title
    fileCharacteristics.description = description
    fileCharacteristics.use_category = useCategory.value
    fileCharacteristics.file_type = fileType ? fileType.value : ''
    fileCharacteristics.file_format = fileFormat ? fileFormat.value : ''
    fileCharacteristics.format_version = formatVersion ? formatVersion.value : ''
    if (isSequential) {
      fileCharacteristics.csv_delimiter = csvDelimiter
      fileCharacteristics.csv_has_header = csvHasHeader
      // take only one char, since there are two due to backslash being an escape character
      if (csvQuoteChar.trim() === '\\') {
        fileCharacteristics.csv_quoting_char = csvQuoteChar.substring(0, 1)
      } else {
        fileCharacteristics.csv_quoting_char = csvQuoteChar
      }
      fileCharacteristics.csv_record_separator = csvRecordSeparator.value
      fileCharacteristics.encoding = csvEncoding
    }
    this.props.Stores.Qvain.setInEdit(undefined) // close form after saving
  }

  getFormatVersions = (fileFormat) => {
    if (fileFormat !== undefined) {
      return this.state.formatVersions.get(fileFormat.value)
    }
    return []
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <FileContainer>
          <div className="file-form">
            <Label><Translate content="qvain.files.selected.form.title.label" /> *</Label>
            <Translate
              component={Input}
              value={this.state.title}
              onChange={(event) => this.setState({ title: event.target.value })}
              attributes={{ placeholder: 'qvain.files.selected.form.title.placeholder' }}
            />
            <Label><Translate content="qvain.files.selected.form.description.label" /> *</Label>
            <Translate
              component={Textarea}
              value={this.state.description}
              onChange={(event) => this.setState({ description: event.target.value })}
              attributes={{ placeholder: 'qvain.files.selected.form.description.placeholder' }}
            />
            <Label><Translate content="qvain.files.selected.form.use.label" /> *</Label>
            <Translate
              component={CustomSelect}
              value={this.state.useCategory}
              options={
                this.props.Stores.Locale.lang === 'en'
                ? this.state.useCategoriesEn
                : this.state.useCategoriesFi
              }
              onChange={this.handleChangeUse}
              attributes={{ placeholder: 'qvain.files.selected.form.use.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.fileType.label"
            />
            <Translate
              component={CustomSelect}
              value={this.state.fileType}
              onChange={this.handleChangeFileType}
              options={
                this.props.Stores.Locale.lang === 'en'
                ? this.state.fileTypesEn
                : this.state.fileTypesFi
              }
              attributes={{ placeholder: 'qvain.files.selected.form.fileType.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.fileFormat.label"
            />
            <Translate
              component={CustomSelect}
              value={this.state.fileFormat}
              onChange={this.handleChangeFileFormat}
              options={this.state.fileFormats}
              attributes={{ placeholder: 'qvain.files.selected.form.fileFormat.placeholder' }}
            />
            <Translate
              component={Label}
              content="qvain.files.selected.form.formatVersion.label"
            />
            <Translate
              component={CustomSelect}
              value={this.state.formatVersion}
              onChange={(selectedOption) => this.setState({ formatVersion: selectedOption })}
              options={this.getFormatVersions(this.state.fileFormat)}
              attributes={{ placeholder: 'qvain.files.selected.form.fileFormat.placeholder' }}
            />
            <SpacedFormField>
              <Checkbox
                checked={this.state.isSequential}
                onChange={(event) => this.setState({ isSequential: event.target.checked })}
              />
              <Translate
                component={Label}
                content="qvain.files.selected.form.isSequential.label"
              />
            </SpacedFormField>
            {this.state.isSequential && (
              <Fragment>
                <Translate
                  component={Label}
                  content="qvain.files.selected.form.csvDelimiter.label"
                />
                <Translate
                  component={CustomSelect}
                  value={this.state.csvDelimiter}
                  onChange={(selectedOption) => this.setState({ csvDelimiter: selectedOption })}
                  options={delimiters}
                  attributes={{ placeholder: 'qvain.files.selected.form.csvDelimiter.placeholder' }}
                />
                <SpacedFormField>
                  <Checkbox
                    checked={this.state.csvHasHeader}
                    onChange={(event) => this.setState({ csvHasHeader: event.target.checked })}
                  />
                  <Translate
                    component={Label}
                    content="qvain.files.selected.form.csvHasHeader.label"
                  />
                </SpacedFormField>
                <Translate
                  component={Label}
                  content="qvain.files.selected.form.csvRecordSeparator.label"
                />
                <Translate
                  component={CustomSelect}
                  value={this.state.csvRecordSeparator}
                  onChange={(selectedOption) => this.setState({ csvRecordSeparator: selectedOption })}
                  options={[
                    { value: 'lf', label: 'LF' }
                  ]}
                  attributes={{ placeholder: 'qvain.files.selected.form.csvRecordSeparator.placeholder' }}
                />
                <Translate
                  component={Label}
                  content="qvain.files.selected.form.csvQuoteChar.label"
                />
                <Translate
                  component={Input}
                  value={this.state.csvQuoteChar}
                  onChange={(event) => this.setState({ csvQuoteChar: event.target.value })}
                  attributes={{ placeholder: 'qvain.files.selected.form.csvQuoteChar.placeholder' }}
                />
                <Translate
                  component={Label}
                  content="qvain.files.selected.form.csvEncoding.label"
                />
                <Translate
                  component={CustomSelect}
                  value={this.state.csvEncoding}
                  options={encodingType}
                  onChange={(selectedOption) => this.setState({ csvEncoding: selectedOption })}
                  attributes={{ placeholder: 'qvain.files.selected.form.csvEncoding.placeholder' }}
                />
              </Fragment>
            )}
            <Translate
              component={Label}
              style={{ textTransform: 'uppercase' }}
              content="qvain.files.selected.form.identifier.label"
            />
            <p style={{ marginLeft: '10px' }}>{this.props.Stores.Qvain.inEdit.identifier}</p>
            <Translate component={CancelButton} onClick={this.handleCancel} content="qvain.common.cancel" />
            <Translate component={SaveButton} onClick={this.handleSave} content="qvain.common.save" />
          </div>
        </FileContainer>
      </div>
    )
  }
}

const delimiters = [
  { value: 'tab', label: 'Tab' },
  { value: 'space', label: 'Space' },
  { value: 'semicolon', label: 'Semicolon (;)' },
  { value: 'comma', label: 'Comma (,)' },
  { value: 'colon', label: 'Colon (:)' },
  { value: 'dot', label: 'Dot (.)' },
  { value: 'pipe', label: 'Pipe (|)' }
]

const encodingType = [
  { value: 'utf-8', label: 'UTF-8' },
  { value: 'iso-8859-1', label: 'ISO-8859-1' }
]

const getFormatVersion = (fileFormat, formatVersions) => {
  if (formatVersions.has(fileFormat)) {
    return formatVersions.get(fileFormat)
  }
  return undefined
}

const FileContainer = styled(Container)`
  padding: 35px 24px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13);
  margin-bottom: 69px;
  margin-top: 0px;
`;

const SpacedFormField = styled(FormField)`
  margin-bottom: 20px;
`;

export default inject('Stores')(observer(FileForm))
