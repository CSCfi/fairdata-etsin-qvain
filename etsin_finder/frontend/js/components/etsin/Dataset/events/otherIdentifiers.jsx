import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import styled from 'styled-components'
import idnToLink from '@/utils/idnToLink'
import { OtherID, SectionSideBar } from './common'

const OtherIdentifiers = ({ otherIdentifiers }) => {
    if (!(otherIdentifiers?.length > 0)) {
        return null
    }

    const filterAntiLinks = (idn) => {
        if (idnToLink(idn) === "") {
            return false
        }

        return true
    }

    const links = otherIdentifiers.filter(filterAntiLinks)

    const linkObjectArray = links.map(otherIdentifier => ({
        url: idnToLink(otherIdentifier),
        otherIdentifier,
    }))

    return (
        <SectionSideBar>
            <OtherIdentifiersList>
                {linkObjectArray.map(link => (
                    <OtherID key={link.otherIdentifier} data-testid={`other-identifier-${link.otherIdentifier}`}>
                        {link.url && (
                            <a data-testid={`other-identifier-link-${link.otherIdentifier}`} href={link.url}>
                                {link.otherIdentifier}
                            </a>
                        )}
                        {!link.url && link.otherIdentifier}
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

export default observer(OtherIdentifiers)
