"""Tests for index views."""

import json

from html.parser import HTMLParser

from .basetest import BaseTest

DATASET_ID = "10000000-2000-3000-4000-500000000001"
METAX_DATASET_URL = f"https://fake-metax-v3:443/v3/datasets/{DATASET_ID}"


class ScriptFinder(HTMLParser):
    """HTML parser that finds scripts in input data."""

    def __init__(self):
        super().__init__()
        self.in_script = None
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        if tag == "script":
            self.in_script = dict(attrs)

    def handle_endtag(self, tag):
        if tag == "script":
            self.in_script = None

    def handle_data(self, data):
        if self.in_script:
            self.scripts.append({**self.in_script, "content": data})


class TestIndexViews(BaseTest):
    """Tests for the index views."""

    def test_initial_dataset(self, requests_mock, unauthd_client):
        """Test that initial dataset is included in a script tag in the index page."""
        dataset_json = {
            "id": DATASET_ID,
            "state": "published",
            "persistent_identifier": "doi:10.234567/test-123",
            "access_rights": {
                "license": [
                    {
                        "url": "http://uri.suomi.fi/codelist/fairdata/license/code/CC-BY-4.0"
                    }
                ]
            },
            "actors": [
                {
                    "roles": ["creator"],
                    "organization": {"url": "https://example.org"},
                }
            ],
        }
        requests_mock.get(METAX_DATASET_URL, json=dataset_json)
        response = unauthd_client.get(f"/dataset/{DATASET_ID}")
        assert response.status_code == 200
        assert "text/html" in response.headers["Content-Type"]

        finder = ScriptFinder()
        finder.feed(response.text)

        initial_dataset_script = next(
            (s for s in finder.scripts if s.get("id") == "initial-dataset"), None
        )
        assert initial_dataset_script
        assert initial_dataset_script.get("type") == "application/json"
        data = json.loads(initial_dataset_script.get("content").strip())
        assert data == dataset_json
