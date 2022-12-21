"""Argument parsing helper utils."""

from webargs.flaskparser import FlaskParser
import marshmallow


class JsonOrQueryFlaskParser(FlaskParser):
    """FlaskParser with custom default values."""

    DEFAULT_VALIDATION_STATUS = 400  # Return 400 instead of 422 for invalid args

    DEFAULT_LOCATION = "json_or_query"

    DEFAULT_UNKNOWN_BY_LOCATION = dict(
        json_or_query=marshmallow.RAISE,
        **FlaskParser.DEFAULT_UNKNOWN_BY_LOCATION,
    )

    __location_map__ = dict(
        json_or_query="load_json_or_query",
        **FlaskParser.__location_map__,
    )

    def load_json_or_query(self, request, schema):
        """Load args from json if Content-Type is application/json, otherwise use query string."""
        if request.is_json:
            return self.load_json(request, schema)
        return self.load_querystring(request, schema)


parser = JsonOrQueryFlaskParser()
