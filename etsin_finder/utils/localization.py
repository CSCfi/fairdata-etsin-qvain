# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Language and translation utilities"""

from flask import request
from etsin_finder.auth.authentication_fairdata_sso import get_sso_environment_prefix

languages = ['en', 'fi']
default_language = 'en'

# Map common locales to languages
locale_mapping = {
    'en_US': 'en',
    'en_GB': 'en',
    'en': 'en',
    'fi_FI': 'fi',
    'fi': 'fi',
}

def get_language_cookie():
    """Get value of language cookie."""
    env_prefix = get_sso_environment_prefix()
    if env_prefix:
        return request.cookies.get(f'{env_prefix}_fd_language')
    else:
        return request.cookies.get('fd_language')

def get_language():
    """
    Get language for request.

    Use value lang cookie if it is set. Otherwise determine
    language from the accept-languages header.
    """
    cookie_lang = get_language_cookie()
    if cookie_lang in languages:
        return cookie_lang

    supported_locales = locale_mapping.keys()
    locale = request.accept_languages.best_match(supported_locales)
    return locale_mapping.get(locale, default_language)


translations = {
    'fi': {
        'etsin.title': 'Etsin | Tutkimusaineistojen hakupalvelu',
        'etsin.description': ('Kuvailutietojen perusteella käyttäjät voivat etsiä aineistoja ja arvioida'
                              'löytämiensä aineistojen käyttökelpoisuutta tarpeisiinsa.'),
        'qvain.title': 'Qvain | Tutkimusaineiston metatietotyökalu',
        'qvain.description': ('Fairdata Qvain -työkalu tekee datasi '
                              'kuvailun ja julkaisemisen helpoksi.')
    },
    'en': {
        'etsin.title': 'Etsin | Research Dataset Finder ',
        'etsin.description': 'Etsin enables you to find research datasets from all fields of science.',
        'qvain.title': 'Qvain | Research Dataset Description Tool',
        'qvain.description': 'Fairdata Qvain tool makes describing and publishing your research data effortless for you.',
    }
}

def translate(lang, key):
    """Return translation from the translations dict for a given language."""
    lang_translations = translations.get(lang)
    if not lang_translations:
        return f'invalid language: {lang}' % lang
    translation = lang_translations.get(key)
    if not translation:
        return f'missing translation: {lang}.{key}'
    return translation
