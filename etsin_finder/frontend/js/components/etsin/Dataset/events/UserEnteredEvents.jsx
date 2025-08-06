import { useStores } from "@/stores/stores";
import Subhead from "./Subhead";
import { observer } from 'mobx-react'
import ProvenanceRows from "./ProvenanceRows";

function UserEnteredEvents() {
    const {
        Etsin: {
            EtsinDataset: { hasUserEnteredEvents, userEnteredProvenances }
        }
    } = useStores()

    /*If the dataset has user-based events, the subtitle and event rows are 
    generated:*/
    if (hasUserEnteredEvents) {
        return (
            <>
                <Subhead text="dataset.events_idn.events.subheads.userEnteredEvents" />
                {/*Displaying general/user-based events: */}
                <ProvenanceRows provenance={userEnteredProvenances} />
            </>
        )
    }

    //Otherwise, this component isn't displayed:
    return null
}

export default observer(UserEnteredEvents);
