import React, { Component } from 'react'
import styled from 'styled-components'
import Translate from 'react-translate-component'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Button from '../../general/button'

class AddButton extends Component {
  static propTypes = {
    Stores: PropTypes.object.isRequired,
    getter: PropTypes.array,
    setter: PropTypes.func.isRequired,
    selection: PropTypes.object,
    translation: PropTypes.string.isRequired,
    model: PropTypes.func.isRequired,
  }

  static defaultProps = {
    getter: [],
    selection: undefined,
  }

  add = () => {
    const { getter, setter, model, selection: selectionOrig } = this.props
    const selection = { ...selectionOrig }
    if (Object.keys(selection).length !== 0 && !getter.some((item) => item.url === selection.url)) {
      setter([...getter, model(selection.name, selection.url)])
    }
  }

  render() {
    const { translation } = this.props
    const { readonly } = this.props.Stores.Qvain
    return (
      <ButtonContainer>
        <AddNewButton type="button" onClick={this.add} disabled={readonly}>
          <Translate content={translation} />
        </AddNewButton>
      </ButtonContainer>
    )
  }
}

export default inject('Stores')(observer(AddButton))

export const ButtonContainer = styled.div`
  text-align: right;
`
export const AddNewButton = styled(Button)`
  margin: 0;
  margin-top: 11px;
`
