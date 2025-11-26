import Translate from '@/utils/Translate'
import { FilterCategory, Section } from './filterSection'
import styled from 'styled-components'
import moment from 'moment'
import DateFormats from '@/components/qvain/utils/date'
import useQuery from '../../general/useQuery'
import { useNavigate } from 'react-router'
import { InvertedButton } from '@/components/general/button'
import { observer } from 'mobx-react'
import { FacetInput } from '@/components/general/FacetInput'
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

/*If the temporal query value represents the first or the last day of a 
year, convert it to the year only. Otherwise, use the original value, as 
the user likely entered an ISO date. */
const getTemporalValue = (queryValue) => {
    const monthDayPart = queryValue.substring("YYYY-".length)
    if (monthDayPart === "01-01" || monthDayPart == "12-31") {
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

    /*If, at the start of the component lifecycle, the query contains either 
    of the temporal query params, it indicates that the user has performed a 
    temporal search using the values of these params. In this case, keep the 
    facet open and populate the inputs with the values retrieved from the 
    query.

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
        } else {
            if (temporalStartQueryValue) {
                setTemporalStart(getTemporalValue(temporalStartQueryValue))
            }

            if (temporalEndQueryValue) {
                setTemporalEnd(getTemporalValue(temporalEndQueryValue))
            }

            setTemporalOpen(true)
        }
    }, [query, resetTemporal, setTemporalStart, setTemporalEnd, setTemporalOpen])

    const fetchDatasets = () => {
        setTemporalValidationError(null)

        let validStart = null
        let validEnd = null

        if (!temporalStart || !temporalEnd) {
            if (!temporalStart && !temporalEnd) {
                query.delete(temporalStartQueryKey)
                query.delete(temporalEndQueryKey)
                navigate(`/datasets?${query.toString()}`)
                return
            } else if (!temporalStart) {
                query.delete(temporalStartQueryKey)
            } else if (!temporalEnd) {
                query.delete(temporalEndQueryKey)
            }
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

        validStart && query.set(temporalStartQueryKey, validStart)
        validEnd && query.set(temporalEndQueryKey, validEnd)

        navigate(`/datasets?${query.toString()}`)
    }

    return (
        <Section data-testid="temporal">
            <Translate
                component={FilterCategory}
                onClick={() => { setTemporalOpen(!temporalOpen) }}
                aria-expanded={temporalOpen}
                content="search.aggregations.temporal.title"
            />
            <TemporalRow className={temporalOpen ? "open" : ""} aria-hidden={!temporalOpen}>
                <Column>
                    <Translate component="label" content="search.aggregations.temporal.start" htmlFor="start" />
                    <Translate
                        component={FacetInput}
                        id="start"
                        attributes={{ placeholder: "search.aggregations.temporal.placeholder" }}
                        autoComplete="off"
                        value={temporalStart}
                        onChange={e => setTemporalStart(e.target.value)} />
                </Column>
                <Column>
                    <Translate component="label" content="search.aggregations.temporal.end" htmlFor="end" />
                    <Translate
                        component={FacetInput}
                        id="end"
                        attributes={{ placeholder: "search.aggregations.temporal.placeholder" }}
                        autoComplete="off"
                        value={temporalEnd}
                        onChange={e => setTemporalEnd(e.target.value)} />
                </Column>
                <Translate component={Button} onClick={fetchDatasets} content="search.aggregations.temporal.button" />
            </TemporalRow>
            <ErrorContainer className={temporalOpen ? "open" : ""} aria-hidden={!temporalOpen}>
                {temporalValidationError && <Translate component={ValidationError} content={temporalValidationError} />}
            </ErrorContainer>
        </Section>
    )
}

// TODO: Animate in the same way as FilterItems in filterSection.jsx
const TemporalRow = styled.div`
    display: flex;
    justify-content: start;
    align-items: flex-end;
    max-height: 0;
    overflow: hidden;
    &.open {
        max-height: 100%;
        padding: 1em;
    }
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    margin-right: 0.5em;
`

const Button = styled(InvertedButton)`
    padding: 0.3em 0.6em;
    margin: 0;
    margin-left: 0.2em
`

const ErrorContainer = styled.div`
    max-height: 0;
    overflow: hidden;
    &.open {
        max-height: 100%;
    }
`

const ValidationError = styled.p`
    padding: 0 1em;
    color: red;
`

export default observer(TemporalSection)