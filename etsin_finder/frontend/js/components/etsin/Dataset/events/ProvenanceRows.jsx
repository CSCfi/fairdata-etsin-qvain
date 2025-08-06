import { observer } from "mobx-react";
import Event from "./event";
import PropTypes from "prop-types";

/*Returns provenance (a.k.a. event) objects passed within an array prop as 
Event components (rows of a table): */
const ProvenanceRows = ({ provenance }) => {
    return (
        <>
            {provenance.map(event => (
                <Event event={event} key={`provenance-${event.id}`} />
            ))}
        </>
    )
}

ProvenanceRows.propTypes = {
    provenance: PropTypes.arrayOf(PropTypes.object)
}

export default observer(ProvenanceRows);