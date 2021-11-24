"""Localization tests."""

from etsin_finder.utils import localization


class TestLocalization:
    """Localization tests."""

    def test_same_translations(self):
        """Test that all languages have same translations."""
        en_translations = set(localization.translations.get("en").keys())
        fi_translations = set(localization.translations.get("fi").keys())
        assert en_translations == fi_translations

    def test_translate(self, mocker):
        """Test that translate returns translation in correct language."""
        mocker.patch(
            "etsin_finder.utils.localization.translations",
            {
                "en": {"testing.translation": "Translation {test}"},
                "fi": {"testing.translation": "Käännös {test}"},
            },
        )
        assert (
            localization.translate("en", "testing.translation", context={"test": 123})
            == "Translation 123"
        )
        assert (
            localization.translate("fi", "testing.translation", context={"test": 123})
            == "Käännös 123"
        )

    def test_get_multilang_value(self):
        """Test that get_multilang_value uses correct language if available."""
        multilang = {"en": "English", "fi": "Finnish"}
        assert localization.get_multilang_value("en", multilang) == "English"
        assert localization.get_multilang_value("fi", multilang) == "Finnish"
        assert localization.get_multilang_value("en", {"sv": "Swedish"}) == "Swedish"
