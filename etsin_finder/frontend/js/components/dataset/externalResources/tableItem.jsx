import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import PropTypes from 'prop-types'

import checkDataLang from '../../../utils/checkDataLang'
import sizeParse from '../../../utils/sizeParse'
import checkNested from '../../../utils/checkNested'
import FileIcon from '../downloads/fileIcon'
import Info from '../downloads/info'
import { InvertedButton, TransparentButton } from '../../general/button'

class TableItem extends Component {
  constructor(props) {
    super(props)
    if (props.item.type === 'dir') {
      this.state = {
        modalIsOpen: false,
        name: props.item.details.directory_name,
        titleAlt: props.item.details.file_count,
      }
    } else {
      this.state = {
        modalIsOpen: false,
        name: props.item.details.file_name,
        titleAlt: props.item.details.title,
      }
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

  render() {
    return (
      <TableRow key={`filelist-${this.props.index}`}>
        <FileType>
          {this.props.item.type === 'dir' ? (
            <TransparentButton
              noPadding
              noMargin
              tabIndex="-1"
              color={this.props.theme.color.primary}
              onClick={() => this.props.changeFolder(this.state.name, this.props.item.identifier)}
              title={translate('dataset.dl.file_types.directory')}
            >
              <FileIcon type={this.props.item.type} />
            </TransparentButton>
          ) : (
            <FileIcon type={this.props.item.type} title={this.props.item.type} />
          )}
        </FileType>
        {this.props.item.type === 'dir' ? (
          <FileName>
            <TransparentButton
              noPadding
              noMargin
              color={this.props.theme.color.primary}
              onClick={() => this.props.changeFolder(this.state.name, this.props.item.identifier)}
            >
              <Translate className="sr-only" content="dataset.dl.file_types.directory" />
              <p>{this.state.name}</p>
            </TransparentButton>
            {this.state.titleAlt ? (
              <TitleAlt>
                <Translate content="dataset.dl.fileAmount" with={{ amount: this.state.titleAlt }} />
              </TitleAlt>
            ) : (
              ''
            )}
          </FileName>
        ) : (
          <FileName>
            <p>{this.state.name}</p>
            {this.state.titleAlt ? <TitleAlt>{this.state.titleAlt}</TitleAlt> : null}
          </FileName>
        )}
        <FileSize>{sizeParse(this.props.item.details.byte_size, 1)}</FileSize>
        <FileCategory>
          {checkNested(this.props.item.use_category, 'pref_label')
            ? checkDataLang(this.props.item.use_category.pref_label)
            : ''}
        </FileCategory>
        <FileButtons>
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
          <HideSmButton thin onClick={this.openModal} disabled={!this.props.access}>
            <Translate content="dataset.dl.download" />
            <Translate
              className="sr-only"
              content="dataset.dl.item"
              with={{ item: this.state.name }}
            />
          </HideSmButton>
          <Info
            name={this.state.name}
            id={this.props.item.identifier}
            title={this.props.item.details.title}
            size={sizeParse(this.props.item.details.byte_size, 1)}
            category={
              checkNested(this.props.item.use_category, 'pref_label')
                ? checkDataLang(this.props.item.use_category.pref_label)
                : undefined
            }
            description={this.props.item.description}
            type={this.props.item.type}
            open={this.state.modalIsOpen}
            closeModal={this.closeModal}
          />
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
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    display: initial;
  }
`

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${p => p.theme.color.superlightgray};
  }
  td {
    vertical-align: middle;
    border: none;
    &:first-of-type {
      padding: 0;
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
  padding: 0.7em;
  text-align: center;
  display: table-cell;
  flex-wrap: wrap;
`

TableItem.propTypes = {
  item: PropTypes.shape({
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    file_count: PropTypes.number,
    byte_size: PropTypes.number,
    identifier: PropTypes.string.isRequired,
    category: PropTypes.object,
    description: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    color: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      gray: PropTypes.string.isRequired,
    }),
  }).isRequired,
  changeFolder: PropTypes.func.isRequired,
  access: PropTypes.bool.isRequired,
}

export default withTheme(TableItem)
