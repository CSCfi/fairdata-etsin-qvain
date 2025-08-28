import json

from etsin_finder.views.index_views import render_manifest_tags

# Example manifest from https://vite.dev/guide/backend-integration
manifest_json = """{
  "_shared-B7PI925R.js": {
    "file": "assets/shared-B7PI925R.js",
    "name": "shared",
    "css": ["assets/shared-ChJ_j-JJ.css"]
  },
  "_shared-ChJ_j-JJ.css": {
    "file": "assets/shared-ChJ_j-JJ.css",
    "src": "_shared-ChJ_j-JJ.css"
  },
  "baz.js": {
    "file": "assets/baz-B2H3sXNv.js",
    "name": "baz",
    "src": "baz.js",
    "isDynamicEntry": true
  },
  "views/bar.js": {
    "file": "assets/bar-gkvgaI9m.js",
    "name": "bar",
    "src": "views/bar.js",
    "isEntry": true,
    "imports": ["_shared-B7PI925R.js"],
    "dynamicImports": ["baz.js"]
  },
  "views/foo.js": {
    "file": "assets/foo-BRBmoGS9.js",
    "name": "foo",
    "src": "views/foo.js",
    "isEntry": true,
    "imports": ["_shared-B7PI925R.js"],
    "css": ["assets/foo-5UjPuW-k.css"]
  }
}"""


def test_render_manifest_entries_foo():
    manifest = json.loads(manifest_json)
    entries = render_manifest_tags(manifest, "views/foo.js")
    assert entries == [
        '<link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />',
        '<link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />',
        '<script type="module" src="assets/foo-BRBmoGS9.js"></script>',
        '<link rel="modulepreload" href="assets/shared-B7PI925R.js" />',
    ]


def test_render_manifest_entries_bar():
    manifest = json.loads(manifest_json)
    entries = render_manifest_tags(manifest, "views/bar.js")
    assert entries == [
        '<link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />',
        '<script type="module" src="assets/bar-gkvgaI9m.js"></script>',
        '<link rel="modulepreload" href="assets/shared-B7PI925R.js" />',
    ]


def test_render_manifest_entries_bar_with_dynamic():
    manifest = json.loads(manifest_json)
    entries = render_manifest_tags(
        manifest, "views/bar.js", preload_dynamic_imports=True
    )
    assert entries == [
        '<link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />',
        '<script type="module" src="assets/bar-gkvgaI9m.js"></script>',
        '<link rel="modulepreload" href="assets/shared-B7PI925R.js" />',
        '<link rel="modulepreload" href="assets/baz-B2H3sXNv.js" />',
    ]
