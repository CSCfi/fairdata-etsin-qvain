import { observer } from 'mobx-react'
import styled from 'styled-components'

import Modal from '@/components/general/modal'
import { DangerButton, TableButton } from '@/components/qvain/general/buttons'
import { ConfirmClose } from '@/components/qvain/general/modal/confirmClose'
import { HelpField, Input, Label } from '@/components/qvain/general/modal/form'
import { useStores } from '@/stores/stores'
import Translate from '@/utils/Translate'
import { useEffect, useState } from 'react'
import Response from '../response'
import MetadataModalState from './MetadataModalState'
import { findOption, getOptions, makeOption } from './options'
import { labelStyle, MetadataSelect, selectStylesNarrow } from './select'

const MetadataModal = () => {
  const Stores = useStores()
  const [state] = useState(() => new MetadataModalState(Stores))
  const {
    Locale,
    Qvain: { metadataModalFile, readonly },
  } = Stores
  const { translate } = Locale
  const options = getOptions(Locale)

  useEffect(() => {
    state.openFile(metadataModalFile)
  }, [state, metadataModalFile])

  return (
    <Modal
      contentLabel="metadatamodal"
      isOpen={!!metadataModalFile}
      onRequestClose={state.requestClose}
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
        options={state.formatOptions}
        value={makeOption(state.values.fileFormat)}
        onChange={state.setFileFormat}
        isDisabled={readonly}
        isLoading={state.formatVersionsMap.length === 0}
        field="fileFormat"
      />
      <MetadataSelect
        inputId="pas_format_version"
        options={state.getformatVersionOptions()}
        required={state.getformatVersionOptions().length > 0}
        value={makeOption(state.values.formatVersion)}
        onChange={state.setFormatVersion}
        isDisabled={readonly}
        isLoading={state.formatVersionsMap.length === 0}
        isSearchable={false}
        field="formatVersion"
      />
      <MetadataSelect
        inputId="pas_file_encoding"
        options={options.encoding}
        value={findOption(state.values.encoding, options.encoding)}
        isDisabled={readonly}
        onChange={state.setEncoding}
        field="encoding"
      />
      {state.isCsv && (
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
              value={findOption(state.values.csvDelimiter, options.delimiter)}
              isDisabled={readonly}
              onChange={state.setCsvDelimiter}
              styles={selectStylesNarrow}
              field="csvDelimiter"
            />

            <MetadataSelect
              inputId="pas_csv_record_separator"
              options={options.separator}
              value={findOption(state.values.csvRecordSeparator, options.separator)}
              isDisabled={readonly}
              onChange={state.setCsvRecordSeparator}
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
                  value={state.values.csvQuotingChar}
                  disabled={readonly}
                  onChange={state.handleChangeCsvQuotingChar}
                />
              </div>
            </Label>

            <MetadataSelect
              inputId="pas_csv_has_header"
              options={options.hasHeader}
              value={findOption(state.values.csvHasHeader, options.hasHeader)}
              isDisabled={readonly}
              onChange={state.setCsvHasHeader}
              styles={selectStylesNarrow}
              field="csvHasHeader"
            />
          </div>
        </CsvOptions>
      )}
      <Buttons>
        <TableButton disabled={state.values.loading} onClick={state.requestClose}>
          <Translate content={'qvain.files.metadataModal.buttons.close'} />
        </TableButton>
        <DangerButton
          id="save-button"
          disabled={state.values.loading || readonly}
          onClick={state.saveChanges}
        >
          <Translate content={'qvain.files.metadataModal.buttons.save'} />
        </DangerButton>
      </Buttons>
      <ConfirmClose
        show={state.confirmClose}
        onCancel={state.hideConfirmClose}
        onConfirm={state.close}
        disabled={state.loading}
      />
      {(state.loading || state.response) && (
        <ResponseOverlay>
          <div style={{ width: '100%' }}>
            <Response response={state.response} />
            {!state.loading &&
              (state.reponse?.criticalError ? (
                <AutoWidthTableButton onClick={state.close}>
                  <Translate content={'qvain.files.metadataModal.buttons.close'} />
                </AutoWidthTableButton>
              ) : (
                <AutoWidthTableButton onClick={state.clearResponse}>
                  <Translate content={'qvain.files.metadataModal.buttons.hideError'} />
                </AutoWidthTableButton>
              ))}
          </div>
        </ResponseOverlay>
      )}
    </Modal>
  )
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

export default observer(MetadataModal)
