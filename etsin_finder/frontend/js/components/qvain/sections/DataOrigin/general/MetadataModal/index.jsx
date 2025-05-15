import { action, autorun, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styled from 'styled-components'

import Modal from '@/components/general/modal'
import { DangerButton, TableButton } from '@/components/qvain/general/buttons'
import { ConfirmClose } from '@/components/qvain/general/modal/confirmClose'
import { HelpField, Input, Label } from '@/components/qvain/general/modal/form'
import { getResponseError } from '@/components/qvain/utils/responseError'
import { getPASMeta } from '@/stores/view/common.files.items'
import Translate from '@/utils/Translate'
import Response from '../response'

import { withStores } from '@/stores/stores'
import AbortClient, { isAbort } from '@/utils/AbortClient'
import { findOption, getOptions, makeOption } from './options'
import { labelStyle, MetadataSelect, selectStylesNarrow } from './select'

export class MetadataModal extends Component {
  @observable
  formatFetchStatus = 'loading'

  client = new AbortClient()

  static propTypes = {
    Stores: PropTypes.object.isRequired,
  }

  state = {
    formatVersionsMap: {},
    formatOptions: [],
    response: null,
    fileChanged: false,
    confirmClose: false,
    criticalError: false,
    fileIdentifier: null,

    // PAS Metadata
    fileFormat: undefined,
    formatVersion: undefined,
    encoding: undefined,
    csvDelimiter: undefined,
    csvRecordSeparator: undefined,
    csvQuotingChar: undefined,
    csvHasHeader: undefined,
  }

  constructor() {
    super()
    makeObservable(this)
  }

  async componentDidMount() {
    this.initialize()
    await this.fetchformatVersions()
    const { Qvain } = this.props.Stores
    this.autorunDisposer = autorun(async () => {
      const file = Qvain.metadataModalFile || {}
      if (file.identifier !== this.state.fileIdentifier) {
        this.initialize()
        if (this.formatFetchStatus === 'error') {
          await this.fetchformatVersions()
        }
      }
    })
  }

  async componentWillUnmount() {
    this.client.abort()
    if (this.autorunDisposer) {
      this.autorunDisposer()
    }
  }

  @action
  setFormatFetchStatus(value) {
    this.formatFetchStatus = value
  }

  getformatVersionOptions() {
    return (this.state.formatVersionsMap[this.state.fileFormat] || []).map(v => ({
      value: v,
      label: v,
    }))
  }

  setFileFormat = formatOption => {
    this.setState({
      fileFormat: formatOption?.value,
      formatVersion: '',
      fileChanged: true,
    })
  }

  patchFileCharacteristics = (identifier, data) => {
    const { original } = this.props.Stores.Qvain
    const { metaxV3Url } = this.props.Stores.Env
    const crId = original?.identifier

    const url = metaxV3Url('fileCharacteristics', identifier)
    const request = this.client
      .put(url, this.dataToV3(data), {
        params: { dataset: crId },
        headers: { 'Content-Type': 'application/json' },
      })
      .then(resp => ({
        data: {
          characteristics: resp.data,
        },
      }))
    return request.catch(error => {
      if (!isAbort(error)) {
        throw error
      }
    })
  }

  setFormatVersion = versionOption => {
    this.setState({
      formatVersion: versionOption?.value,
      fileChanged: true,
    })
  }

  setEncoding = encodingOption => {
    this.setState({
      encoding: encodingOption?.value,
      fileChanged: true,
    })
  }

  setCsvDelimiter = csvDelimiterOption => {
    this.setState({
      csvDelimiter: csvDelimiterOption?.value,
      fileChanged: true,
    })
  }

  setCsvRecordSeparator = csvRecordSeparatorOption => {
    this.setState({
      csvRecordSeparator: csvRecordSeparatorOption?.value,
      fileChanged: true,
    })
  }

  setCsvHasHeader = csvHasHeaderOption => {
    this.setState({
      csvHasHeader: csvHasHeaderOption?.value,
      fileChanged: true,
    })
  }

  handleChangeCsvQuotingChar = event => {
    this.setState({
      csvQuotingChar: event.target.value,
      fileChanged: true,
    })
  }

  requestClose = () => {
    if (this.state.loading) {
      return
    }

    if (!this.state.fileChanged) {
      this.close()
    } else {
      this.showConfirmClose()
    }
  }

  showConfirmClose = () => {
    this.setState({
      confirmClose: true,
    })
  }

  hideConfirmClose = () => {
    this.setState({
      confirmClose: false,
    })
  }

  clearError = () => {
    this.setState({
      response: null,
    })
  }

  close = () => {
    this.props.Stores.Qvain.setMetadataModalFile(null)
  }

  getCharacteristics = () => {
    const characteristics = {
      file_format: this.state.fileFormat,
      format_version: this.state.formatVersion,
      encoding: this.state.encoding,
      csv_has_header: this.state.csvHasHeader,
      csv_delimiter: this.state.csvDelimiter,
      csv_record_separator: this.state.csvRecordSeparator,
      csv_quoting_char: this.state.csvQuotingChar,
    }

    if (!this.isCsv()) {
      characteristics.csv_has_header = undefined
      characteristics.csv_delimiter = undefined
      characteristics.csv_record_separator = undefined
      characteristics.csv_quoting_char = undefined
    }

    const nonEmpty = Object.fromEntries(
      Object.entries(characteristics).filter(([, v]) => v != null && v !== '')
    )
    return nonEmpty
  }

  validateMetadata = () => {
    const { translate } = this.props.Stores.Locale
    const { fileMetadataSchema } = this.props.Stores.Qvain.Files
    fileMetadataSchema.validate(this.getCharacteristics(), { strict: true })

    // Additional validation for formatVersion
    const versions = this.state.formatVersionsMap[this.state.fileFormat] || []

    if (versions.length === 0) {
      if (this.state.formatVersion) {
        throw new Error(translate('qvain.files.metadataModal.errors.formatVersionNotAllowed'))
      }
    } else if (!versions.includes(this.state.formatVersion)) {
      throw new Error(translate('qvain.files.metadataModal.errors.formatVersionRequired'))
    }
  }

  saveChanges = async () => {
    if (this.state.loading) {
      return
    }

    try {
      this.validateMetadata()
    } catch (error) {
      this.setState({
        response: {
          error: error.message,
        },
      })
      return
    }

    try {
      this.setState({
        loading: true,
      })

      const patchPromise = this.patchFileCharacteristics(
        this.state.fileIdentifier,
        this.getCharacteristics()
      )
      const response = await patchPromise

      // Update file hierarchy with response data, close modal
      this.props.Stores.Qvain.Files.applyPASMeta(getPASMeta(response.data))
      this.setState({
        fileChanged: false,
      })
      this.close()
    } catch (err) {
      console.error(err)
      this.setState({
        response: {
          error: getResponseError(err),
        },
      })
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  dataToV3(data) {
    const { file_format: fileFormat, format_version: formatVersion, ...v3Data } = data

    const formatUrl = this.state.fileFormatVersions.find(
      v => v.fileFormat === fileFormat && v.formatVersion === (formatVersion || '')
    )?.value
    if (formatUrl) {
      v3Data.file_format_version = {
        url: formatUrl,
      }
    }
    return v3Data
  }

  isCsv() {
    return this.state.fileFormat === 'text/csv'
  }

  async fetchformatVersions() {
    const { translate } = this.props.Stores.Locale
    this.setFormatFetchStatus('loading')
    try {
      // Create a list of available versions for each supported file format.
      const fileFormatVersions = await this.props.Stores.Qvain.ReferenceData.getOptions(
        'file_format_version',
        { client: this.client }
      )

      // get array of available versions for each file format
      const formatVersionsMap = {}
      fileFormatVersions.forEach(formatVersion => {
        if (formatVersionsMap[formatVersion.inputFileFormat] === undefined) {
          formatVersionsMap[formatVersion.fileFormat] = []
        }
        if (formatVersion.formatVersion !== '') {
          formatVersionsMap[formatVersion.fileFormat].push(formatVersion.formatVersion)
        }
      })

      // use natural sort order for version numbers
      const sortArray = arr => arr.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      Object.values(formatVersionsMap).forEach(versions => sortArray(versions))
      const formatOptions = Object.keys(formatVersionsMap)
      sortArray(formatOptions)

      this.setState({
        formatOptions: formatOptions.map(v => ({ value: v, label: v })),
        formatVersionsMap,
        fileFormatVersions,
      })

      this.setFormatFetchStatus('done')
    } catch (e) {
      if (!isAbort(e)) {
        this.setState({
          criticalError: true,
          response: {
            error: translate('qvain.files.metadataModal.errors.loadingFileFormats'),
          },
        })
      }
      this.setFormatFetchStatus('error')
      throw e
    }
  }

  initialize() {
    const { Qvain } = this.props.Stores
    const file = Qvain.metadataModalFile || {}
    const pasObj = file.pasMeta || {}

    const newState = {
      response: null,
      fileChanged: false,
      confirmClose: false,
      criticalError: false,
      fileIdentifier: file.identifier,
      fileFormat: pasObj.fileFormat ?? '',
      formatVersion: pasObj.formatVersion ?? '',
      encoding: pasObj.encoding ?? '',
      csvDelimiter: pasObj.csvDelimiter ?? '',
      csvRecordSeparator: pasObj.csvRecordSeparator ?? '',
      csvQuotingChar: pasObj.csvQuotingChar ?? '',
      csvHasHeader: pasObj.csvHasHeader ?? '',
    }

    this.setState(newState)
  }

  render() {
    const { Locale } = this.props.Stores
    const { translate } = Locale
    const { metadataModalFile, readonly } = this.props.Stores.Qvain
    const options = getOptions(Locale)

    return (
      <Modal
        contentLabel="metadatamodal"
        isOpen={!!metadataModalFile}
        onRequestClose={this.requestClose}
        customStyles={modalStyles}
      >
        <Translate
          content="qvain.files.metadataModal.header"
          component="h2"
          style={{ marginBottom: 0 }}
        />
        <Translate content="qvain.files.metadataModal.help" component={HelpField} />
        <MetadataSelect
          inputId="pas_file_format"
          options={this.state.formatOptions}
          value={makeOption(this.state.fileFormat)}
          onChange={this.setFileFormat}
          isDisabled={readonly}
          isLoading={this.state.formatVersionsMap.length === 0}
          field="fileFormat"
        />
        <MetadataSelect
          inputId="pas_format_version"
          options={this.getformatVersionOptions()}
          required={this.getformatVersionOptions().length > 0}
          value={makeOption(this.state.formatVersion)}
          onChange={this.setFormatVersion}
          isDisabled={readonly}
          isLoading={this.state.formatVersionsMap.length === 0}
          isSearchable={false}
          field="formatVersion"
        />
        <MetadataSelect
          inputId="pas_file_encoding"
          options={options.encoding}
          value={findOption(this.state.encoding, options.encoding)}
          isDisabled={readonly}
          onChange={this.setEncoding}
          field="encoding"
        />
        {this.isCsv() && (
          <CsvOptions>
            <Translate
              content="qvain.files.metadataModal.csvOptions"
              component="h3"
              style={{ marginBottom: 0, marginTop: '0.3rem' }}
            />

            <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '26em' }}>
              <MetadataSelect
                inputId="pas_csv_delimiter"
                options={options.delimiter}
                value={findOption(this.state.csvDelimiter, options.delimiter)}
                isDisabled={readonly}
                onChange={this.setCsvDelimiter}
                styles={selectStylesNarrow}
                field="csvDelimiter"
              />

              <MetadataSelect
                inputId="pas_csv_record_separator"
                options={options.separator}
                value={findOption(this.state.csvRecordSeparator, options.separator)}
                isDisabled={readonly}
                onChange={this.setCsvRecordSeparator}
                styles={selectStylesNarrow}
                field="csvRecordSeparator"
              />

              <Label htmlFor="pas_csv_quoting_char" style={labelStyle}>
                {translate('qvain.files.metadataModal.fields.csvQuotingChar')}
                <div style={selectStylesNarrow.control()}>
                  <Input
                    id="pas_csv_quoting_char"
                    placeholder={translate('qvain.files.metadataModal.placeholders.csvQuotingChar')}
                    type="text"
                    value={this.state.csvQuotingChar}
                    disabled={readonly}
                    onChange={this.handleChangeCsvQuotingChar}
                  />
                </div>
              </Label>

              <MetadataSelect
                inputId="pas_csv_has_header"
                options={options.hasHeader}
                value={findOption(this.state.csvHasHeader, options.hasHeader)}
                isDisabled={readonly}
                onChange={this.setCsvHasHeader}
                styles={selectStylesNarrow}
                field="csvHasHeader"
              />
            </div>
          </CsvOptions>
        )}
        <Buttons>
          <TableButton disabled={this.state.loading} onClick={this.requestClose}>
            <Translate content={'qvain.files.metadataModal.buttons.close'} />
          </TableButton>
          <DangerButton
            id="save-button"
            disabled={this.state.loading || readonly}
            onClick={this.saveChanges}
          >
            <Translate content={'qvain.files.metadataModal.buttons.save'} />
          </DangerButton>
        </Buttons>
        <ConfirmClose
          show={this.state.confirmClose}
          onCancel={this.hideConfirmClose}
          onConfirm={this.close}
          disabled={this.state.loading}
        />
        {(this.state.loading || this.state.response) && (
          <ResponseOverlay>
            <div style={{ width: '100%' }}>
              <Response response={this.state.response} />
              {!this.state.loading &&
                (this.state.criticalError ? (
                  <AutoWidthTableButton onClick={this.close}>
                    <Translate content={'qvain.files.metadataModal.buttons.close'} />
                  </AutoWidthTableButton>
                ) : (
                  <AutoWidthTableButton onClick={this.clearError}>
                    <Translate content={'qvain.files.metadataModal.buttons.hideError'} />
                  </AutoWidthTableButton>
                ))}
            </div>
          </ResponseOverlay>
        )}
      </Modal>
    )
  }
}

const Buttons = styled.div`
  margin-top: 1rem;
`

const CsvOptions = styled.div`
  margin-bottom: -1rem;
`
export const modalStyles = {
  content: {
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'relative',
    minWidth: '32vw',
    width: '30em',
    maxWidth: '30em',
    margin: '0.5em',
    border: 'none',
    padding: '2em',
    boxShadow: '0px 6px 12px -3px rgba(0, 0, 0, 0.15)',
    overflow: 'auto',
  },
  overlay: {
    zIndex: '100',
  },
}

const ResponseOverlay = styled.div`
  display: flex;
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  width: 100%;
  top: 0;
  left: 0;
  height: 100%;
  justify-content: center;
  align-items: center;
  padding: 2em;
`

export const AutoWidthTableButton = styled(TableButton)`
  width: auto;
  max-width: none;
  padding: 0 0.5em;
`

export default withStores(observer(MetadataModal))
