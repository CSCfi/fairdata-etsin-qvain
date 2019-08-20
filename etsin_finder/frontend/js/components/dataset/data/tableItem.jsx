{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'
import axios from 'axios'

import checkDataLang, { getDataLang } from '../../../utils/checkDataLang'
import sizeParse from '../../../utils/sizeParse'
import checkNested from '../../../utils/checkNested'
import FileIcon from './fileIcon'
import Info from './info'
import { InvertedButton, TransparentButton, Link } from '../../general/button'
import Loader from '../../general/loader'
import {
  TypeConcept,
  TypeTableDirectory,
  TypeTableFile,
  TypeTableRemote,
} from '../../../utils/propTypes'

class TableItem extends Component {
  constructor(props) {
    super(props)

    let checksum
    if (props.item.remote) {
      checksum = props.item.remote.checksum
    } else if (props.item.file) {
      checksum = props.item.file.checksum
    }

    this.state = {
      modalIsOpen: false,
      name: props.item.name,
      checksum,
      loader: false,
      downloadDisabled: false,
      downloadFailed: false
    }

    this.openModal = this.openModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({ modalIsOpen: true })
  }

  closeModal() {
    this.setState({ modalIsOpen: false })
  }

  changeFolder(name, id) {
    this.setState(
      {
        loader: true,
      },
      () => this.props.changeFolder(name, id)
    )
  }

  downloadItem() {
    this.setState({ downloadDisabled: true },
      () => {
        const url = `/api/dl?cr_id=${this.props.cr_id}${this.props.item.type === 'dir'
          ? `&dir_id=${this.props.item.identifier}`
          : `&file_id=${this.props.item.identifier}`}`
        axios.get(url)
          .then((res) => {
            console.groupCollapsed('%cDownload Response', 'color: blue;')
            console.log('Response data:', res.data);
            console.log('Response status:', res.status);
            console.log('Response status text:', res.statusText);
            console.log('Response headers:', res.headers);
            console.log('Config:', res.config);
            console.groupEnd()
            this.setState({
              downloadDisabled: false,
              downloadFailed: false
            })
            const a = document.createElement('a')
            a.href = url
            a.setAttribute('download', this.props.item.name)
            document.body.appendChild(a)
            a.click()
            // Cleanup
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
          })
          .catch((err) => {
            console.groupCollapsed('%cError in Download', 'color: red;')
            if (err.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(`Response status: %c${err.response.status}`, 'color: red;');
              console.log('Response data:', err.response.data);
              console.log('Response headers:', err.response.headers);
            } else if (err.request) {
              // The request was made but no response was received
              // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log('Request: ');
              console.log(err.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', err.message);
            }
            console.log('Config:', err.config);
            this.setState({
              downloadDisabled: false,
              downloadFailed: true
            })
            console.groupEnd()
          })
      }
    )
  }

  render() {
    return (
      <TableRow key={`filelist-${this.props.index}`}>
        <FileType>
          {this.state.loader ? (
            <Loader active size="2em" />
          ) : (
            <React.Fragment>
              {this.props.item.directory ? (
                <TransparentButton
                  noPadding
                  noMargin
                  tabIndex="-1"
                  color={this.props.theme.color.primary}
                  onClick={() => this.changeFolder(this.state.name, this.props.item.identifier)}
                  title={translate('dataset.dl.file_types.directory')}
                >
                  <FileIcon type={this.props.item.type} />
                </TransparentButton>
              ) : (
                <FileIcon
                  type={this.props.item.type}
                  title={this.props.item.type}
                  default={this.props.item.remote ? 'cloud' : 'file'}
                />
              )}
            </React.Fragment>
          )}
        </FileType>
        {this.props.fields.name && this.props.item.directory ? (
          <FileName>
            <TransparentButton
              noPadding
              noMargin
              color={this.props.theme.color.primary}
              onClick={() => this.changeFolder(this.props.item.name, this.props.item.identifier)}
            >
              <Translate className="sr-only" content="dataset.dl.file_types.directory" />
              <p>{this.props.item.name}</p>
            </TransparentButton>
            <TitleAlt>
              <Translate
                content="dataset.dl.fileAmount"
                with={{ amount: this.props.item.directory.file_count }}
              />
            </TitleAlt>
          </FileName>
        ) : (
          <FileName>
            <p>{this.props.item.name}</p>
          </FileName>
        )}
        {this.props.fields.size && <FileSize>{sizeParse(this.props.item.byte_size, 1)}</FileSize>}
        {this.props.fields.category
          && (checkNested(this.props.item.use_category, 'pref_label')
            ? (
              <FileCategory lang={getDataLang(this.props.item.use_category.pref_label)}>
                {checkDataLang(this.props.item.use_category.pref_label)}
              </FileCategory>
            )
            : (
              <FileCategory />
            )
          )
        }
        <FileButtons>
          {this.props.fields.infoBtn && (
            <React.Fragment>
              <InvertedButton
                thin
                color={this.props.theme.color.gray}
                disabled={!this.props.allowInfo}
                onClick={this.openModal}
              >
                <Translate content="dataset.dl.info" />
                <Translate
                  className="sr-only"
                  content="dataset.dl.info_about"
                  with={{ file: this.props.item.name }}
                />
              </InvertedButton>
              <Info
                title={this.props.item.title}
                name={this.props.item.name}
                id={this.props.item.identifier}
                size={sizeParse(this.props.item.byte_size, 1)}
                lang={
                  checkNested(this.props.item.use_category, 'pref_label')
                  && getDataLang(this.props.item.use_category.pref_label)
                }
                category={
                  checkNested(this.props.item.use_category, 'pref_label')
                  && checkDataLang(this.props.item.use_category.pref_label)
                }
                checksum={this.state.checksum}
                downloadUrl={
                  this.props.item.remote ? this.props.item.remote.download_url : undefined
                }
                accessUrl={this.props.item.remote ? this.props.item.remote.access_url : undefined}
                allowDownload={this.props.allowDownload}
                description={this.props.item.description}
                type={this.props.item.type}
                open={this.state.modalIsOpen}
                closeModal={this.closeModal}
              />
            </React.Fragment>
          )}
          {this.props.isRemote
            && (this.props.item.remote.download_url || this.props.item.remote.access_url) && (
              // Remote resource download button
              <RemoteDlButton
                thin
                href={
                  this.props.item.remote.download_url
                    ? this.props.item.remote.download_url.identifier
                    : this.props.item.remote.access_url.identifier
                }
                target="_blank"
                rel="noopener noreferrer"
                lang={getDataLang(
                  this.props.item.remote.download_url
                    ? this.props.item.remote.download_url.description
                    : this.props.item.remote.access_url.description
                )}
                title={checkDataLang(
                  this.props.item.remote.download_url
                    ? this.props.item.remote.download_url.description
                    : this.props.item.remote.access_url.description
                )}
              >
                <Translate
                  content={
                    this.props.item.remote.download_url
                      ? 'dataset.dl.download'
                      : 'dataset.dl.go_to_original'
                  }
                />
                <Translate
                  className="sr-only"
                  content="dataset.dl.item"
                  with={{ item: this.props.item.name }}
                />
              </RemoteDlButton>
            )}
          {!this.props.isRemote && this.props.fields.downloadBtn && !this.state.downloadDisabled && (
            <HideSmButton
              thin
              onClick={() => this.downloadItem()}
              disabled={!this.props.allowDownload}
              downloadFailed={this.state.downloadFailed}
            >
              <Translate content={this.state.downloadFailed ? 'dataset.dl.downloadFailed' : 'dataset.dl.download'} />
              <Translate
                className="sr-only"
                content="dataset.dl.item"
                with={{ item: this.props.item.name }}
              />
            </HideSmButton>
          )}
          {!this.props.isRemote && this.state.downloadDisabled && (
            // Ida download button disabled
            <HideSmButton thin disabled>
              <Translate content="dataset.dl.downloading" />
              <Translate
                className="sr-only"
                content="dataset.dl.item"
                with={{ item: this.props.item.name }}
              />
            </HideSmButton>
          )}
        </FileButtons>
      </TableRow>
    )
  }
}

const TitleAlt = styled.p`
  font-size: 0.8em;
  font-weight: 400;
  color: #777;
`

const HideSmButton = styled(InvertedButton)`
  display: none;
  color: ${props => (props.downloadFailed ? props.theme.color.error : props.theme.color.primary)};
  border-color: ${props => (props.downloadFailed ? props.theme.color.error : props.theme.color.primary)};
  :hover {
    color: white;
    background-color: ${props => (props.downloadFailed ? props.theme.color.error : props.theme.color.primary)};
    border-color: ${props => (props.downloadFailed ? props.theme.color.error : props.theme.color.primary)};
  }
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    display: initial;
  }
`

const RemoteDlButton = styled(Link)`
  display: none;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    display: initial;
  }
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${p => p.theme.color.superlightgray};
  }
  td {
    padding: 12px;
    vertical-align: middle;
    border: none;
    &:first-of-type {
      padding: 12px;
      white-space: nowrap;
      width: 1%;
      text-align: center;
    }
    p {
      size: 0.8em;
      margin: 0;
    }
  }
`

const FileType = styled.td``

const FileName = styled.td``

const FileSize = styled.td``

const FileCategory = styled.td`
  display: none;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    display: table-cell;
  }
`

const FileButtons = styled.td`
  text-align: center;
  display: table-cell;
  flex-wrap: wrap;
  width: 1%;
  white-space: nowrap;
`

TableItem.defaultProps = {
  changeFolder: () => {}
}

TableItem.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    identifier: PropTypes.string,
    title: PropTypes.string,
    byte_size: PropTypes.number,
    use_category: TypeConcept,
    description: PropTypes.string,
    type: PropTypes.oneOfType([PropTypes.string, TypeConcept]),
    remote: TypeTableRemote,
    file: TypeTableFile,
    directory: TypeTableDirectory,
  }).isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    color: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gray: PropTypes.string.isRequired,
    }),
  }).isRequired,
  fields: PropTypes.shape({
    size: PropTypes.bool.isRequired,
    name: PropTypes.bool.isRequired,
    category: PropTypes.bool.isRequired,
    downloadBtn: PropTypes.bool.isRequired,
    infoBtn: PropTypes.bool.isRequired,
  }).isRequired,
  changeFolder: PropTypes.func,
  allowDownload: PropTypes.bool.isRequired,
  allowInfo: PropTypes.bool.isRequired,
  isRemote: PropTypes.bool.isRequired,
  cr_id: PropTypes.string.isRequired,
}

export default withTheme(TableItem)
