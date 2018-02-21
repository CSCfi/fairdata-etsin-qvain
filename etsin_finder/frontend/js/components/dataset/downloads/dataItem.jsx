import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
import Translate from 'react-translate-component'
import translate from 'counterpart'
import FileIcon from './fileIcon'
import InfoModal from './infoModal'
import checkDataLang from '../../../utils/checkDataLang'
import sizeParse from '../../../utils/sizeParse'
import checkNested from '../../../utils/checkNested'
import { InvertedButton, TransparentButton } from '../../general/button'

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

class DataItem extends Component {
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
      <tr key={`filelist-${this.props.index}`}>
        <td className="fileIcon">
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
        </td>
        {this.props.item.type === 'dir' ? (
          <td className="fileName">
            <TransparentButton
              noPadding
              noMargin
              color={this.props.theme.color.primary}
              onClick={() => this.props.changeFolder(this.state.name, this.props.item.identifier)}
            >
              <Translate className="screen-reader-only" content="dataset.dl.file_types.directory" />
              <p>{this.state.name}</p>
            </TransparentButton>
            {this.state.titleAlt ? (
              <TitleAlt>
                <Translate content="dataset.dl.fileAmount" with={{ amount: this.state.titleAlt }} />
              </TitleAlt>
            ) : (
              ''
            )}
          </td>
        ) : (
          <td className="fileName">
            <p>{this.state.name}</p>
            {this.state.titleAlt ? <TitleAlt>{this.state.titleAlt}</TitleAlt> : null}
          </td>
        )}
        <td className="fileSize">{sizeParse(this.props.item.details.byte_size, 1)}</td>
        <td className="fileCategory">
          {checkNested(this.props.item.use_category, 'pref_label')
            ? checkDataLang(this.props.item.use_category.pref_label)
            : ''}
        </td>
        <td className="fileButtons">
          <InvertedButton
            thin
            color={this.props.theme.color.gray}
            disabled={!this.props.access}
            onClick={this.openModal}
          >
            <Translate content="dataset.dl.info" />
            <Translate
              className="screen-reader-only"
              content="dataset.dl.info_about"
              with={{ file: this.state.name }}
            />
          </InvertedButton>
          <HideSmButton thin onClick={this.openModal} disabled={!this.props.access}>
            <Translate content="dataset.dl.download" />
            <Translate
              className="screen-reader-only"
              content="dataset.dl.item"
              with={{ item: this.state.name }}
            />
          </HideSmButton>
          <InfoModal
            name={this.state.name}
            id={this.props.item.identifier}
            title={this.props.item.details.title}
            size={sizeParse(this.props.item.details.byte_size, 1)}
            category={
              checkNested(this.props.item.use_category, 'pref_label')
                ? checkDataLang(this.props.item.use_category.pref_label)
                : ''
            }
            description={this.props.item.description}
            type={this.props.item.type}
            open={this.state.modalIsOpen}
            closeModal={this.closeModal}
          />
        </td>
      </tr>
    )
  }
}

export default withTheme(DataItem)
