import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import checkDataLang from '../../../utils/checkDataLang'
import sizeParse from '../../../utils/sizeParse'
import checkNested from '../../../utils/checkNested'
import FileIcon from './fileIcon'
import Info from './info'
import { InvertedLink, InvertedButton, TransparentButton } from '../../general/button'
import Loader from '../../general/loader'

class TableItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modalIsOpen: false,
      name: props.item.name,
      file_count: props.item.file_count ? props.item.file_count : '',
      loader: false,
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

  render() {
    return (
      <TableRow key={`filelist-${this.props.index}`}>
        <FileType>
          {this.state.loader ? (
            <Loader active size="2em" />
          ) : (
            <React.Fragment>
              {this.props.item.type === 'dir' ? (
                <TransparentButton
                  noPadding
                  noMargin
                  tabIndex="-1"
                  color={this.props.theme.color.primary}
                  onClick={() => this.changeFolder(this.state.name, this.props.item.identifier)}
                  title={translate('dataset.dl.file_types.directory')}
                >
                  <FileIcon
                    type={this.props.item.type}
                    default={this.props.item.remote ? 'cloud' : 'file'}
                  />
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
        {this.props.fields.name && this.props.item.type === 'dir' ? (
          <FileName>
            <TransparentButton
              noPadding
              noMargin
              color={this.props.theme.color.primary}
              onClick={() => this.changeFolder(this.state.name, this.props.item.identifier)}
            >
              <Translate className="sr-only" content="dataset.dl.file_types.directory" />
              <p>{this.state.name}</p>
            </TransparentButton>
            {this.state.file_count ? (
              <TitleAlt>
                <Translate
                  content="dataset.dl.fileAmount"
                  with={{ amount: this.state.file_count }}
                />
              </TitleAlt>
            ) : (
              ''
            )}
          </FileName>
        ) : (
          <FileName>
            <p>{this.state.name}</p>
          </FileName>
        )}
        {this.props.fields.size && <FileSize>{sizeParse(this.props.item.byte_size, 1)}</FileSize>}
        {this.props.fields.category && (
          <FileCategory>
            {checkNested(this.props.item.category) ? checkDataLang(this.props.item.category) : ''}
          </FileCategory>
        )}
        <FileButtons>
          {this.props.fields.infoBtn && (
            <React.Fragment>
              <InvertedButton
                thin
                color={this.props.theme.color.gray}
                disabled={!this.props.access}
                onClick={this.openModal}
              >
                <Translate content="dataset.dl.info" />
                <Translate
                  className="sr-only"
                  content="dataset.dl.info_about"
                  with={{ file: this.state.name }}
                />
              </InvertedButton>
              <Info
                name={this.state.name}
                id={this.props.item.identifier}
                size={sizeParse(this.props.item.byte_size, 1)}
                category={
                  checkNested(this.props.item.category)
                    ? checkDataLang(this.props.item.category)
                    : undefined
                }
                checksum={this.props.item.checksum}
                downloadUrl={this.props.item.download_url}
                accessUrl={this.props.item.access_url}
                description={this.props.item.description}
                type={this.props.item.type}
                open={this.state.modalIsOpen}
                closeModal={this.closeModal}
              />
            </React.Fragment>
          )}
          {this.props.fields.downloadBtn && (
            // TODO: add download functionality, probably an axios post request,
            // but it will also be used in the info modal, so a utility for both.
            <HideSmButton thin onClick={this.openModal} disabled={!this.props.access}>
              <Translate content="dataset.dl.download" />
              <Translate
                className="sr-only"
                content="dataset.dl.item"
                with={{ item: this.state.name }}
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

const HideSmButton = styled(InvertedLink)`
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
  changeFolder: () => {},
}

TableItem.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    file_count: PropTypes.number,
    byte_size: PropTypes.number,
    identifier: PropTypes.string,
    category: PropTypes.object,
    description: PropTypes.string,
    access_url: PropTypes.object,
    download_url: PropTypes.object,
    checksum: PropTypes.object,
    resource_type: PropTypes.object,
    remote: PropTypes.bool,
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
  access: PropTypes.bool.isRequired,
}

export default withTheme(TableItem)
