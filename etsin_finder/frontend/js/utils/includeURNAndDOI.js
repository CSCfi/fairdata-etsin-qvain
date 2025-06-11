import otherIdnToLink from "./otherIdnToLink"

// Filter out identifiers in non-DOI or non-URN format:
export function includeURNAndDOI(idn) {
    if (otherIdnToLink(idn) === "") {
        return false
    }

    return true
}