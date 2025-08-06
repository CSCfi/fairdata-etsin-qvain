import Translate from '@/utils/Translate';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/*Made for the Events table. Returns a subhead row with the text string 
received via prop: */
const Subhead = ({ text }) => {
    return (
        <>
            <SubheadRow>
                <Translate component="td" colSpan="5" content={text} />
            </SubheadRow>
        </>
    )
}

Subhead.propTypes = {
    text: PropTypes.string
}

const SubheadRow = styled.tr`
  background-color: ${props => props.theme.color.superlightgray};
`

export default observer(Subhead);