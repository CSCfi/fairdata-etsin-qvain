import React, { Component } from 'react'
import styled, { withTheme } from 'styled-components'
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
    console.log(this.props.access)
    return (
      <tr key={`filelist-${this.props.index}`}>
        <td className="fileIcon">
          {this.props.item.type === 'dir' ? (
            <TransparentButton
              noPadding
              noMargin
              color={this.props.theme.color.primary}
              onClick={() => this.props.changeFolder(this.state.name, this.props.item.identifier)}
              title={this.props.item.type}
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
              <p>{this.state.name}</p>
            </TransparentButton>
            <TitleAlt>{this.state.titleAlt ? `Tiedostoja: ${this.state.titleAlt}` : ''}</TitleAlt>
          </td>
        ) : (
          <td className="fileName">
            <p>{this.state.name}</p>
            <TitleAlt>{this.state.titleAlt}</TitleAlt>
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
            Tietoja
          </InvertedButton>
          <InvertedButton thin onClick={this.openModal} disabled={!this.props.access}>
            Lataa
          </InvertedButton>
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
