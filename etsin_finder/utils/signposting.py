"""Utilities for adding signposting Link headers to dataset responses."""

import re

from flask import Response, request

from etsin_finder.log import log
from etsin_finder.services.metax_v3_service import MetaxV3APIService

# ORCID format: DDDD-DDDD-DDDD-DDDY where D is a digit and Y is a digit or
# capital letter X. See:
# https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier.
# Also, trailing slash is allowed.
ORCID_WITH_OPTIONAL_SLASH_REGEX = re.compile(r"\d{4}-\d{4}-\d{4}-\d{3}[\dX]/?")


def _pid_to_url(pid: str | None) -> str:
    """Convert a persistent identifier to a resolvable URL, or return an empty string if unrecognized."""
    if not pid:
        return ""
    if pid.startswith("doi:"):
        return pid.replace("doi:", "https://doi.org/", 1)
    if pid.lower().startswith("urn:nbn:fi:"):
        return f"https://urn.fi/urn:nbn:fi:{pid[len('urn:nbn:fi:') :]}"
    if pid.startswith(("http:", "https:")):
        return pid
    if pid.startswith("url:reportronic.fi/"):
        return f"https://{pid[4:]}"
    if pid.startswith("reportronic.fi/"):
        return f"https://{pid}"
    if pid.startswith("url:"):
        return pid[4:]
    return ""


def _is_valid_orcid(identifier: str) -> bool:
    # Check if the identifier is compliant with ORCID format, fullmatch
    # rejects extra characters before or after the ORCID id.
    return bool(ORCID_WITH_OPTIONAL_SLASH_REGEX.fullmatch(identifier))


def _orcid_to_url(external_id: str | None) -> str:
    """Normalize an ORCID identifier to an ORCID url

    Returns the normalized URL, or an empty string if the identifier is not a
    recognized ORCID or ORCID URL.
    """
    if not external_id:
        return ""

    domains = [
        "http://orcid.org/",
        "http://www.orcid.org/",
        "https://orcid.org/",
        "https://www.orcid.org/",
        "www.orcid.org/",
        "orcid.org/",
    ]

    for domain in domains:
        if not external_id.startswith(domain):
            continue
        id_part = external_id[len(domain) :]
        if not _is_valid_orcid(id_part):
            continue
        if not domain.startswith(("http://", "https://")):
            return f"https://{external_id}"
        return external_id

    if external_id.lower().startswith("orcid:"):
        orcid = external_id[len("orcid:") :].lstrip()
        if _is_valid_orcid(orcid):
            return f"https://orcid.org/{orcid}"
        # orcid may itself be a full ORCID URL, e.g.
        # "https://orcid.org/0009-0000-0000-0000":
        url = _orcid_to_url(orcid)
        if url != "":
            return url

    if _is_valid_orcid(external_id):
        return f"https://orcid.org/{external_id}"

    return ""


def _form_signposting_link_header(dataset: dict, url: str) -> str:
    """Form a signposting Link header for a dataset.

    See https://signposting.org/FAIR/#level1.

    Args:
        dataset: Dataset dictionary from Metax V3.
        url: Metax API URL for the dataset, used as describedby.

    Returns:
        Link header value with cite-as, type, author, license and describedby
        entries.
    """
    link_header = ""
    pid: str = dataset.get("persistent_identifier")
    pid_url = _pid_to_url(pid)

    if pid_url:
        link_header += f'<{pid_url}> ; rel="cite-as"'

    link_header += (
        f'{" , " if link_header else ""}<https://schema.org/Dataset> ; rel="type" , '
        f'<https://schema.org/AboutPage> ; rel="type"'
    )

    # Only person actors with an ORCID identifier qualify.
    # The first creator found is used:
    actors: list = dataset.get("actors", [])
    for actor in actors:
        if "creator" not in actor.get("roles", []):
            continue

        external_orcid = _orcid_to_url(
            actor.get("person", {}).get("external_identifier")
        )

        if external_orcid != "":
            link_header += f' , <{external_orcid}> ; rel="author"'
            break

    if url:
        link_header += f' , <{url}> ; rel="describedby" ; type="application/json"'

        if pid_url and pid.startswith("doi:"):
            link_header += (
                f' , <{pid_url}> ; rel="describedby" ; type="application/ld+json"'
            )
            link_header += f' , <{pid_url}> ; rel="describedby" ; type="application/vnd.datacite.datacite+json"'

    licenses: list = dataset.get("access_rights", {}).get("license") or []
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
    if (
        not dataset
        or dataset["state"] != "published"
        or dataset.get("deprecated")
        or "etsin" not in request.headers.get("X-Etsin-App", "").lower()
    ):
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
