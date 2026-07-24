"""Utilities for adding signposting Link headers to dataset responses."""

import re

from flask import Response

from etsin_finder.services.metax_v3_service import MetaxV3APIService
from etsin_finder.log import log

# Matches dataset page paths and captures the dataset UUID.
# In the first parameter string:
# - ^dataset/     -> path must start with "dataset/"
# - ([0-9a-f-]+)  -> capture group 1 => UUID (hexadecimal digits and hyphens
#                    allowed)
# - (?:/(?:...))? -> non-capturing groups (?:) => optional subpage suffix:
#                    /maps, /events or /data
# - $             -> nothing is allowed after the optional suffix
# In second parameter:
# re.IGNORECASE   -> case-insensitive, e.g. /Dataset/ and /MAPS also match
# Examples: dataset/<UUID> or dataset/<UUID>/maps
DATASET_PATH_REGEX = re.compile(
    r"^dataset/([0-9a-f-]+)(?:/(?:maps|events|data))?$", re.IGNORECASE
)


def _pid_to_url(pid: str) -> str:
    """Validate persisent identifier and convert it into a link"""
    if not pid:
        return ""
    if pid.startswith("doi:"):
        return pid.replace("doi:", "https://doi.org/", 1)
    if pid.lower().startswith("urn:nbn:fi:"):
        return f"https://urn.fi/urn:nbn:fi:{pid[len("urn:nbn:fi:"):]}"
    if pid.startswith("http:") or pid.startswith("https:"):
        return pid
    if pid.startswith("url:reportronic.fi/"):
        return f"https://{pid[4:]}"
    if pid.startswith("reportronic.fi/"):
        return f"https://{pid}"
    if pid.startswith("url:"):
        return pid[4:]
    return ""


def _form_signposting_link_header(dataset: dict, url: str) -> str:
    """Form a signposting Link header for a dataset.

    Args:
        dataset: Dataset dictionary from Metax V3.
        url: Metax API URL for the dataset, used as describedby.

    Returns:
        Link header value with cite-as, type, author, license and describedby
        entries.
    """
    link_header = ""
    pid = dataset.get("persistent_identifier")
    pid_url = _pid_to_url(pid)

    if pid_url:
        link_header += f'<{pid_url}> ; rel="cite-as"'

    link_header += (
        f'{" , " if link_header else ""}<https://schema.org/Dataset> ; rel="type"'
    )

    actors = dataset.get("actors", [])
    for actor in actors:
        if "creator" in actor.get("roles", []) and actor.get("organization", {}).get(
            "url"
        ):
            link_header += f' , <{actor.get("organization").get("url")}> ; rel="author"'
            break

    if url:
        link_header += f' , <{url}> ; rel="describedby" ; type="application/json"'

        if pid_url and pid.startswith("doi:"):
            link_header += (
                f' , <{pid_url}> ; rel="describedby" ; type="application/ld+json"'
            )
            link_header += f' , <{pid_url}> ; rel="describedby" ; type="application/vnd.datacite.datacite+json"'

    licenses = dataset.get("access_rights", {}).get("license") or []
    for license in licenses:
        if license.get("url"):
            link_header += f' , <{license.get("url")}> ; rel="license"'

    return link_header


def _add_link_header_to_response(dataset_id: str, resp: Response) -> None:
    """Fetch dataset from Metax V3 and add a signposting Link header to the response.

    Args:
        dataset_id: identifier of the dataset to fetch.
        resp: Response object to which the Link header will be added.
    """
    try:
        metaxV3API = MetaxV3APIService()
        dataset_metax_url = metaxV3API.metax_url(
            "/v3/datasets/{identifier}", identifier=dataset_id
        )
        dataset = metaxV3API.get_dataset(dataset_id)
        if dataset:
            # Add the Link header to the response object:
            resp.headers["Link"] = _form_signposting_link_header(
                dataset=dataset, url=dataset_metax_url
            )
    except Exception as e:
        log.error(f"Failed to set Link header: {e}")


def set_signposting_link_header(path: str, resp: Response) -> None:
    """Add a signposting Link header when the path refers to a dataset.

    Args:
        path: Etsin resource path, e.g. "dataset/<dataset id>".
        resp: Response object to which the Link header will be added.
    """
    # Check whether the path refers to a single dataset:
    match = DATASET_PATH_REGEX.match(path)
    if match:
        # Extract the dataset identifier from the path:
        dataset_id = match.group(1)
        _add_link_header_to_response(dataset_id=dataset_id, resp=resp)
