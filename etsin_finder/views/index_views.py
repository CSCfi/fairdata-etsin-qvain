# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Used for routing traffic from Flask to frontend."""

from typing import List, Optional, Tuple
from flask import (
    Blueprint,
    make_response,
    render_template,
    render_template_string,
    request,
    session,
    current_app,
)
import requests
import json

from etsin_finder.utils.abort import abort
from etsin_finder.auth.authentication import is_authenticated
from etsin_finder.auth.authentication_direct_proxy import (
    is_authenticated_through_direct_proxy,
)
from etsin_finder.auth.authentication_fairdata_sso import (
    is_authenticated_through_fairdata_sso,
    log_sso_values,
)
from etsin_finder.log import log
from etsin_finder.utils.localization import get_language, translate

index_views = Blueprint("index_views", __name__)


@index_views.route("/", defaults={"path": ""})
@index_views.route("/<path:path>")
def index(path):
    """All other requests to the app should be routed via here. Renders the base file for the frontend app.

    Args:
        path (str): path

    Returns:
        Render the frontend.

    """
    # Check if URL endpoint force enabling SSO has been visited
    sso_enabled_through_url = request.args.get(
        "sso_authentication", default="false", type=str
    )
    resp = make_response(_render_index_template())
    if sso_enabled_through_url == "true":
        # Force enable SSO cookie for entire domain (Etsin + Qvain)
        shared_domain = current_app.config.get("SESSION_COOKIE_DOMAIN")
        formatted_shared_domain = "." + shared_domain
        resp.set_cookie("sso_authentication", "true", domain=formatted_shared_domain)

    return resp


def collect_manifest_chunks(
    manifest: dict, entry_point: str, prefix="", preload_dynamic_imports=False
) -> Tuple[List[str], List[str], List[str]]:
    """Collect chunks from Vite build manifest."""
    seen = set()
    module_chunks = []  # Chunks loaded immediately
    preload_chunks = []  # Chunks loaded in the background
    css_chunks = []

    def recurse(chunk_name: str, is_entry=False):
        if chunk_name in seen:
            return  # Chunk already visited
        seen.add(chunk_name)
        chunk = manifest.get(chunk_name)

        if is_entry:
            module_chunks.append(f'{prefix}{chunk["file"]}')
        else:
            preload_chunks.append(f'{prefix}{chunk["file"]}')

        # Collect css
        for css in chunk.get("css", []):
            if css not in css_chunks:
                css_chunks.append(f"{prefix}{css}")

        # Collect imports, optionally include dynamic imports
        imports = chunk.get("imports", [])
        if preload_dynamic_imports:
            imports.extend(chunk.get("dynamicImports", []))

        for imported in imports:
            recurse(imported)

    recurse(entry_point, is_entry=True)
    return module_chunks, preload_chunks, css_chunks


def render_manifest_tags(
    manifest: dict, entry_point: str, prefix="", preload_dynamic_imports=False
) -> List[str]:
    """Render tags from Vite build manifest."""
    modules, preloads, css = collect_manifest_chunks(
        manifest,
        entry_point,
        prefix=prefix,
        preload_dynamic_imports=preload_dynamic_imports,
    )
    tags = [f'<link rel="stylesheet" href="{v}" />' for v in css]
    tags.extend(f'<script type="module" src="{v}"></script>' for v in modules)
    tags.extend(f'<link rel="modulepreload" href="{v}" />' for v in preloads)
    return tags


def get_entry_tags(entry_point) -> Optional[List[str]]:
    """Load entry points of the React app from Vite manifest.json."""
    try:
        # See https://vite.dev/guide/backend-integration for build manifest documentation
        with open("etsin_finder/frontend/build/.vite/manifest.json") as manifest_file:
            manifest = json.load(manifest_file)
            return render_manifest_tags(
                manifest, entry_point, prefix="/build/", preload_dynamic_imports=True
            )
    except Exception as e:
        current_app.logger.error(f"Failed to load app entry point: {e!r} ")
        return None


def _render_index_template(saml_errors=[], slo_success=False, template_string=None):
    """Load saml attributes if logged in through old proxy, and log values.

    Args:
        saml_errors (list): List of SAML errors
        slo_success (bool): SLO status

    Returns:
        index.html rendered template

    """
    is_auth = is_authenticated()
    if is_auth:
        if is_authenticated_through_direct_proxy():
            log.info(session.get("samlUserdata").items())
        if is_authenticated_through_fairdata_sso():
            log_sso_values()

    lang = get_language()
    if request.headers.get("X-Etsin-App", None) == "qvain":
        app_title = translate(lang, "qvain.title")
        app_description = translate(lang, "qvain.description")
    else:
        app_title = translate(lang, "etsin.title")
        app_description = translate(lang, "etsin.description")

    sso_host = current_app.config.get("SSO", {}).get("HOST")
    matomo_url = current_app.config.get("MATOMO_URL")

    # Enable WEBPACK_DEV_PROXY to include the development server scripts
    # instead of the built files in the index template.
    is_development = bool(current_app.config.get("WEBPACK_DEV_PROXY"))
    entry_tags = []
    if not is_development:
        entry_tags = get_entry_tags("js/index.jsx")

    context = {
        "lang": lang,
        "app_title": app_title,
        "app_description": app_description,
        "sso_host": sso_host,
        "matomo_url": matomo_url,
        "is_development": is_development,
        # Entry points of the React app
        "entry_tags": entry_tags,
    }
    return render_template("index.html", **context)


@index_views.route("/api", defaults={"path": ""})
@index_views.route("/api/<path:path>")
def api404(path):
    """Abort with page not found urls that does not exist."""
    abort(404)
