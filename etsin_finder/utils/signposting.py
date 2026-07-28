"""Utilities for adding signposting Link headers to dataset responses."""

import re

from flask import Response

from etsin_finder.services.metax_v3_service import MetaxV3APIService
from etsin_finder.log import log


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


def set_signposting_link_header(dataset: dict, resp: Response) -> None:
    """Add a signposting Link header to the response.

    Args:
        dataset: The dataset to link to.
        resp: Response object to which the Link header will be added.
    """
    if not dataset or dataset["state"] != "published" or dataset.get("deprecated"):
        return

    try:
        metax_v3_api = MetaxV3APIService()
        dataset_metax_url = metax_v3_api.metax_url(
            "/v3/datasets/{identifier}", identifier=dataset["id"]
        )
        # Add the Link header to the response object:
        resp.headers["Link"] = _form_signposting_link_header(
            dataset=dataset, url=dataset_metax_url
        )
    except Exception as e:
        log.error(f"Failed to set Link header: {e}")
