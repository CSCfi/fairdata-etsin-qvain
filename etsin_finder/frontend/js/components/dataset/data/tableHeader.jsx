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
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import axios from 'axios'

import sizeParse from '../../../utils/sizeParse'
import { InvertedButton } from '../../general/button'

export default class TableHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      downloadAllUrl: '',
      downloadDisabled: false,
    }
  }

  downloadAll = () => {
    this.setState(
      {
        downloadAllUrl: `/api/dl?cr_id=${this.props.crId}`,
        downloadDisabled: true,
        downloadFailed: false
      },
      () => {
        const url = this.state.downloadAllUrl
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
            a.setAttribute('download', '')
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
      <Header>
        <div>
          <TableTitle>
            <Translate content={`dataset.dl.${this.props.title}`} />
          </TableTitle>
          <ObjectCount>
            <Translate
              component="span"
              content="dataset.dl.fileAmount"
              with={{ amount: this.props.objectCount }}
            />
            {this.props.totalSize !== 0 && ` (${sizeParse(this.props.totalSize, 1)})`}
          </ObjectCount>
        </div>
        {this.props.downloadAll && !this.state.downloadDisabled && (
          <ButtonsCont>
            <InvertedButton
              color="white"
              disabled={!this.props.allowDownload}
              onClick={() => this.downloadAll()}
            >
              <Translate content={this.state.downloadFailed ? 'dataset.dl.downloadFailed' : 'dataset.dl.downloadAll'} />
              <Translate className="sr-only" content="dataset.dl.file_types.both" />
            </InvertedButton>
          </ButtonsCont>
        )}
        {this.state.downloadDisabled && (
          <ButtonsCont>
            <InvertedButton
              color="white"
              disabled
            >
              <Translate content="dataset.dl.downloading" />
              <Translate className="sr-only" content="dataset.dl.file_types.both" />
            </InvertedButton>
          </ButtonsCont>

        )}
      </Header>
    )
  }
}

const Header = styled.div`
  background-color: ${p => p.theme.color.primary};
  padding: 1em 1.5em;
  color: white;
  display: flex;
  justify-content: space-between;
`

const ButtonsCont = styled.div`
  display: flex;
  align-items: center;
`

const TableTitle = styled.h4`
  margin-bottom: 0;
`

const ObjectCount = styled.p`
  margin-bottom: 0;
`

TableHeader.defaultProps = {
  totalSize: 0,
  downloadAll: false,
  crId: '',
}

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  totalSize: PropTypes.number,
  objectCount: PropTypes.number.isRequired,
  crId: PropTypes.string,
  allowDownload: PropTypes.bool.isRequired,
  downloadAll: PropTypes.bool,
}
