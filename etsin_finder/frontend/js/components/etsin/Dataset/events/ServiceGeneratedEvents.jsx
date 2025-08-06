import { useStores } from "@/stores/stores";
import Translate from "@/utils/Translate";
import styled from "styled-components";
import { IDLink } from "./common";
import Subhead from "./Subhead";
import { observer } from 'mobx-react'
import ProvenanceRows from "./ProvenanceRows";

function ServiceGeneratedEvents() {
    const {
        Etsin: {
            EtsinDataset: {
                hasServiceGeneratedEvents,
                deletedVersions,
                isEmbargoExpired,
                isDeprecated,
                dateDeprecated,
                embargoDate,
                pasProvenances
            }
        },
        Locale: { dateFormat }
    } = useStores()

    /*If there are service-generated events, the subtitle and event rows are 
    generated depending on what service-generated events the dataset has: */
    if (hasServiceGeneratedEvents) {
        return (
            <>
                <Subhead text="dataset.events_idn.events.subheads.serviceGeneratedEvents" />
                <ProvenanceRows provenance={pasProvenances} />
                {isEmbargoExpired && (
                    // Displaying the expired embargo as an event row:
                    <tr key={embargoDate}>
                        {/* Embargo as a title: */}
                        <td>
                            <Translate component={EmbargoTitle} content="dataset.events_idn.embargo.title" />
                        </td>
                        {/* Expired embargo as an event: */}
                        <Translate component="td" content="dataset.events_idn.embargo.event" />
                        {/* Who (none): */}
                        <td>-</td>
                        {/* When (date of embargo expiration): */}
                        <td>{dateFormat(embargoDate)}</td>
                        {/* Where (none): */}
                        <td>-</td>
                    </tr>
                )}
                {isDeprecated && (
                    // Displaying deprecated datasets
                    <tr key={dateDeprecated}>
                        {/* Title and Description */}
                        {/* Event description as header */}
                        <td>
                            <Translate component={EventTitle} content="dataset.events_idn.deprecations.title" />
                            <Translate component="span" content="dataset.events_idn.deprecations.description" />
                        </td>
                        {/* Dataset deprecation as event */}
                        <Translate component="td" content="dataset.events_idn.deprecations.event" />
                        {/* Who (none), not recorded */}
                        <td>-</td>
                        {/* Date of deprecation */}
                        <td>{dateFormat(dateDeprecated)}</td>
                        {/* Where (none), not recorded */}
                        <td>-</td>
                    </tr>
                )}
                {/* Display deleted events */}
                {deletedVersions.map(single => (
                    <tr key={single.identifier}>
                        {/* Event description as header */}
                        <td>
                            <Translate
                                component={EventTitle}
                                content="dataset.events_idn.events.deletionTitle"
                            />
                            <span>
                                <Translate
                                    component="span"
                                    content="dataset.events_idn.events.deletionOfDatasetVersion"
                                />
                                {single.label}
                                <br />
                                <Translate
                                    component="span"
                                    content="dataset.events_idn.events.deletionIdentifier"
                                />
                                {
                                    <IDLink href={single.url} rel="noopener noreferrer" target="_blank">
                                        {single.identifier}
                                    </IDLink>
                                }
                            </span>
                        </td>
                        {/* Dataset deletion as event */}
                        <Translate component="td" content="dataset.events_idn.events.deletionEvent" />
                        {/* Who (none), not recorded */}
                        <td>-</td>
                        {/* Date of deletion */}
                        <td>{dateFormat(single.dateRemoved.input)}</td>
                        {/* Where (none), not recorded */}
                        <td>-</td>
                    </tr>
                ))}
            </>
        )
    }

    /*If the dataset doesn't have any service-generated events, this 
    component isn't displayed: */
    return null
}

const EventTitle = styled.h3`
  font-size: 1em;
  font-weight: bold;
`

const EmbargoTitle = styled(EventTitle)`
  margin-bottom: 0;
`

export default observer(ServiceGeneratedEvents);