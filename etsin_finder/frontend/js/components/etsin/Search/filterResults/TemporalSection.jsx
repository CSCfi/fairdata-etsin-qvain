import Translate from '@/utils/Translate'
import { FilterCategory, Section } from './filterSection'
import styled from 'styled-components'
import moment from 'moment'
import DateFormats from '@/components/qvain/utils/date'
import useQuery from '../../general/useQuery'
import { useNavigate } from 'react-router'
import { InvertedButton } from '@/components/general/button'
import { observer } from 'mobx-react'
import { useEffect } from 'react'
import { useStores } from '@/stores/stores'

// Helpers:
const isValidInput = (date) => {
    return moment(date, [DateFormats.ISO8601_DATE_FORMAT, "YYYY"], true).isValid()
}

const isValidYear = (date) => {
    return moment(date, "YYYY", true).isValid()
}

const convertToISODate = (date, endAsYear = false) => {
    // If the date contains only year information and the endAsYear parameter 
    // is set to true, the return value will be formatted as <year>-12-31.
    if (endAsYear) {
        return moment(date).endOf("year").format(DateFormats.ISO8601_DATE_FORMAT)
    }

    // If the date contains only the start year, it is converted to the format 
    // <year>-01-01. 
    // If the date is already provided in ISO date format, a value with the 
    // same format as the original date will be returned.
    return moment(date).format(DateFormats.ISO8601_DATE_FORMAT)
}

/* If the temporal query value represents the first or the last day of a 
year, convert it to the year only. Otherwise, use the original value, as 
the user likely entered an ISO date. */
const getTemporalValue = (queryValue, field) => {
    const monthDayPart = queryValue.substring("YYYY-".length)

    if (monthDayPart === "01-01" && field === "from") {
        return moment(queryValue).format("YYYY")
    }

    if (monthDayPart === "12-31" && field === "to") {
        return moment(queryValue).format("YYYY")
    }

    return queryValue
}

// Component:
function TemporalSection() {
    const {
        Etsin: {
            Search: {
                temporalStart,
                temporalEnd,
                temporalOpen,
                temporalValidationError,
                setTemporalStart,
                setTemporalEnd,
                setTemporalOpen,
                setTemporalValidationError,
                resetTemporal
            },
        },
    } = useStores()

    const query = useQuery()
    const navigate = useNavigate()

    const temporalStartQueryKey = "temporal__start_date"
    const temporalEndQueryKey = "temporal__end_date"

    /* If the query contains either of the temporal query params at the start 
    of the component lifecycle or when the query changes, this indicates that 
    the user has performed a temporal search using the values of these params. 
    In this case, keep the facet open and populate the inputs with the values 
    retrieved from the query.

    If a query parameter indicating temporal start or end is an ISO date, use 
    it as-is in the input. If it represents the first day of the year 
    (temporal start) or the last day of the year (temporal end), populate the 
    input with the year only, as this likely indicates the user originally 
    entered a year. */
    useEffect(() => {
        const temporalStartQueryValue = query.get(temporalStartQueryKey)
        const temporalEndQueryValue = query.get(temporalEndQueryKey)

        if (!temporalStartQueryValue && !temporalEndQueryValue) {
            resetTemporal()
            setTemporalOpen(false)
        } else {
            if (temporalStartQueryValue) {
                setTemporalStart(getTemporalValue(temporalStartQueryValue, "from"))
            }

            if (temporalEndQueryValue) {
                setTemporalEnd(getTemporalValue(temporalEndQueryValue, "to"))
            }

            setTemporalOpen(true)
        }
    }, [query, resetTemporal, setTemporalStart, setTemporalEnd, setTemporalOpen])

    const fetchDatasets = () => {
        setTemporalValidationError(null)

        let validStart = null
        let validEnd = null

        if (!temporalStart) {
            query.delete(temporalStartQueryKey)
        }

        if (!temporalEnd) {
            query.delete(temporalEndQueryKey)
        }

        if (temporalStart) {
            // Accepted temporalStart formats: YYYY or YYYY-MM-DD:
            if (isValidInput(temporalStart)) {
                validStart = convertToISODate(temporalStart)
            } else {
                setTemporalValidationError("search.aggregations.temporal.validationErrors.invalidStart")
                return
            }
        }

        if (temporalEnd) {
            // Accepted temporalEnd formats: YYYY or YYYY-MM-DD:
            if (isValidInput(temporalEnd)) {
                validEnd = isValidYear(temporalEnd) ? convertToISODate(temporalEnd, true) : temporalEnd
            } else {
                setTemporalValidationError("search.aggregations.temporal.validationErrors.invalidEnd")
                return
            }
        }

        if (validStart && validEnd && (new Date(validEnd) < new Date(validStart))) {
            setTemporalValidationError("search.aggregations.temporal.validationErrors.startGtEnd")
            return
        }

        if (validStart) {
            validStart && query.set(temporalStartQueryKey, validStart)
        }

        if (validEnd) {
            validEnd && query.set(temporalEndQueryKey, validEnd)
        }

        navigate(`/datasets?${query.toString()}`)
    }

    const fetchOnEnter = (key) => {
        if (key === "Enter") {
            fetchDatasets()
        }
    }

    return (
        <Section data-testid="temporal">
            <Translate
                component={FilterCategory}
                content="search.aggregations.temporal.title"
                onClick={() => { setTemporalOpen(!temporalOpen) }}
                aria-expanded={temporalOpen}
            />
            <Grid aria-hidden={!temporalOpen} className={temporalOpen ? "open" : ""}>
                <Translate
                    htmlFor="start"
                    component="label"
                    content="search.aggregations.temporal.start"
                    className="start-label"
                />
                <Translate
                    id="start"
                    component={FacetInput}
                    value={temporalStart}
                    onChange={e => setTemporalStart(e.target.value)}
                    onKeyDown={e => fetchOnEnter(e.key)}
                    attributes={{
                        placeholder: "search.aggregations.temporal.placeholder",
                        "aria-label": "search.filterSearches.temporalStart"
                    }}
                    autoComplete="off"
                    className="start-input"
                />
                <Translate
                    htmlFor="end"
                    component="label"
                    content="search.aggregations.temporal.end"
                    className="end-label"
                />
                <Translate
                    component={FacetInput}
                    id="end"
                    value={temporalEnd}
                    onChange={e => setTemporalEnd(e.target.value)}
                    onKeyDown={e => fetchOnEnter(e.key)}
                    attributes={{
                        placeholder: "search.aggregations.temporal.placeholder",
                        "aria-label": "search.filterSearches.temporalEnd"
                    }}
                    autoComplete="off"
                    className="end-input"
                />
                <Translate
                    component={Button}
                    content="search.aggregations.temporal.button"
                    onClick={fetchDatasets}
                />
            </Grid>
            {temporalValidationError &&
                <Translate
                    component={ValidationError}
                    content={temporalValidationError}
                    className={temporalOpen ? "open" : ""}
                />}
        </Section>
    )
}

// TODO: Animate in the same way as FilterItems in filterSection.jsx
const Grid = styled.div`
    display: grid;
    justify-content: start;
    grid-template-columns: auto auto auto;
    grid-template-rows: auto auto;
    grid-template-areas: 
        "start-label end-label ."
        "start-input end-input button";
    row-gap: 0.2em;
    column-gap: 0.5em;
    height: 0;
    overflow: hidden;
    padding: 0 1em;
    > .start-label {
        grid-area: start-label;
    }
    > .end-label {
        grid-area: end-label;
    }
    > .start-input {
        grid-area: start-input;
    }
    > .end-input {
        grid-area: end-input;
    }
    > button {
        grid-area: button;
    }
    &.open {
        height: 100%;
        padding: 1em;
    }
`

const FacetInput = styled.input`
    display: block;
    box-sizing: border-box;
    width: 100%;
    max-width: 5em;
    min-width: 4em;
    padding: 0.4em 0.6em;
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px;
    color: ${props => props.theme.color.darkgray};
    &::placeholder {
        color: ${props => props.theme.color.gray};
        font-style: italic;
    }
    &:hover {
        border-color: hsl(0, 0%, 70%);
    }
    &:focus {
        border-color: hsl(0, 0%, 70%);
  }

`

const Button = styled(InvertedButton)`
    padding: 0.3em 0.6em;
    margin: 0;
    margin-left: 0.2em;
`

const ValidationError = styled.p`
    color: red;
    margin: 0 1em;
    height: 0;
    overflow: hidden;
    &.open {
        height: 100%;
        margin-bottom: 1em;
    }
`

export default observer(TemporalSection)