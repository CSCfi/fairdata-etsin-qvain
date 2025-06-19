import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import otherIdnToLink from '@/utils/otherIdnToLink'
import { OtherID } from '@/components/etsin/general/identifiers'

const OtherIdentifiers = ({ otherIdentifiers }) => {

    // Return null, if there isn't other identifiers:
    if (!(otherIdentifiers?.length > 0)) {
        return null
    }

    /** Create an array based on items in links array. Each item is 
     * reformatted as an object, each containing two key-value pairs. 
     * As the value of url key, add the item of the iteration round 
     * transformed to a link. As the value of otherIdentifier key, add 
     * the actual item of the iteration round: */
    const linkObjectArray = otherIdentifiers.map(otherIdentifier => ({
        url: otherIdnToLink(otherIdentifier),
        otherIdentifier,
    }))

    return (
        <SectionSideBar>
            <OtherIdentifiersList>
                {/** Iterate and render every DOI and URN identifier as an 
                 * unordered list if url key of the item in the iteration 
                 * round has a value: */}
                {linkObjectArray.map(idnObj => (
                    <OtherID key={idnObj.otherIdentifier} data-testid={`other-identifier-${idnObj.otherIdentifier}`}>
                        {idnObj.url && (
                            <a data-testid={`other-identifier-link-${idnObj.otherIdentifier}`} href={idnObj.url}>
                                {idnObj.otherIdentifier}
                            </a>
                        )}

                        {!idnObj.url && idnObj.otherIdentifier}
                    </OtherID>
                ))}
            </OtherIdentifiersList>
        </SectionSideBar>
    )
}

OtherIdentifiers.defaultProps = {
    otherIdentifiers: [],
}

OtherIdentifiers.propTypes = {
    otherIdentifiers: PropTypes.arrayOf(PropTypes.string),
}

const OtherIdentifiersList = styled.ul`
    li {
        padding-bottom: 0.5em;
    }
    li:last-child {
        padding-bottom: 0;
    }
`

const SectionSideBar = styled.section`
  margin: 0em;
`

export default observer(OtherIdentifiers)
