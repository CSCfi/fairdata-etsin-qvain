import React, { Component } from 'react'
import styled from 'styled-components'
import FileIcon from './fileIcon'
import InfoModal from './infoModal'
import checkDataLang from '../../../utils/checkDataLang'
import sizeParse from '../../../utils/sizeParse'

const TitleAlt = styled.p`
  font-size: 0.8em;
  font-weight: 400;
  color: #777;
`

export default class DataItem extends Component {
  constructor(props) {
    super(props)

    if (props.item.type === 'dir') {
      this.state = {
        modalIsOpen: false,
        name: props.item.details.directory_name,
        titleAlt: props.item.childAmount,
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
            <button
              className="folderButton"
              onClick={() => this.props.changeFolder(this.state.name)}
            >
              <FileIcon type={this.props.item.type} />
            </button>
          ) : (
            <FileIcon type={this.props.item.type} />
          )}
        </td>
        {this.props.item.type === 'dir' ? (
          <td className="fileName">
            <button
              className="folderButton"
              onClick={() => this.props.changeFolder(this.state.name)}
            >
              <p>{this.state.name}</p>
            </button>
            <TitleAlt>
              {`Kuvailtuja tiedostoja: ${this.state.titleAlt}`}
            </TitleAlt>
          </td>
        ) : (
          <td className="fileName">
            <p>{this.state.name}</p>
            <TitleAlt>{this.state.titleAlt}</TitleAlt>
          </td>
        )}
        <td className="fileSize">
          {sizeParse(this.props.item.details.byte_size, 1)}
        </td>
        <td className="fileCategory">
          {checkDataLang(this.props.item.use_category.pref_label)}
        </td>
        <td className="fileButtons">
          <button onClick={this.openModal}>Tietoja</button>
          <button onClick={this.openModal}>Lataa</button>
          <InfoModal
            name={this.state.name}
            id={this.props.item.identifier}
            title={this.state.titleAlt}
            size={sizeParse(this.props.item.details.byte_size, 1)}
            category={checkDataLang(this.props.item.use_category.pref_label)}
            type={this.props.item.type}
            open={this.state.modalIsOpen}
            closeModal={this.closeModal}
          />
        </td>
      </tr>
    )
  }
}
