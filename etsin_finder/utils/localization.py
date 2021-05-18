# This file is part of the Etsin service
#
# Copyright 2017-2018 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Language and translation utilities"""

from flask import request, session
from etsin_finder.auth.authentication_fairdata_sso import get_sso_environment_prefix, get_decrypted_sso_session_details

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

def set_language(language):
    """
    Set session language

    Returns True if language is supported, otherwise False.
    """
    if language in languages:
        session['language'] = language
        return True
    return False

def get_language():
    """
    Get language for request.

    Returns first found language in the following order
    * Session language setting
    * SSO language setting
    * Accept-Languages request header
    * Default language
    """
    session_lang = session.get('language')
    if session_lang in languages:
        return session_lang

    sso_session = get_decrypted_sso_session_details() or {}
    sso_lang = sso_session.get('language')
    if sso_lang in languages:
        return sso_lang

    supported_locales = locale_mapping.keys()
    locale = request.accept_languages.best_match(supported_locales)
    return locale_mapping.get(locale, default_language)


translations = {
    'fi': {
        'etsin.download.notification.subject': 'Lataus on aloitettavissa Etsimessä',
        'etsin.download.notification.body.partial': 'Lataus paketille {folder} aineistossa {pref_id} voidaan aloittaa Etsimessä:\n\n{data_url}\n',
        'etsin.download.notification.body.full': 'Lataus aineistolle {pref_id} voidaan aloittaa Etsimessä:\n\n{data_url}\n',
        'etsin.title': 'Etsin | Tutkimusaineistojen hakupalvelu',
        'etsin.description': ('Kuvailutietojen perusteella käyttäjät voivat etsiä aineistoja ja arvioida'
                              'löytämiensä aineistojen käyttökelpoisuutta tarpeisiinsa.'),
        'qvain.title': 'Qvain | Tutkimusaineiston metatietotyökalu',
        'qvain.description': ('Fairdata Qvain -työkalu tekee datasi '
                              'kuvailun ja julkaisemisen helpoksi.')
    },
    'en': {
        'etsin.download.notification.subject': 'Download can be started in Etsin',
        'etsin.download.notification.body.partial': 'Download for package {folder} in dataset {pref_id} can now be started in Etsin:\n\n{data_url}\n',
        'etsin.download.notification.body.full': 'Download for dataset {pref_id} can now be started in Etsin:\n\n{data_url}\n',
        'etsin.title': 'Etsin | Research Dataset Finder ',
        'etsin.description': 'Etsin enables you to find research datasets from all fields of science.',
        'qvain.title': 'Qvain | Research Dataset Description Tool',
        'qvain.description': 'Fairdata Qvain tool makes describing and publishing your research data effortless for you.',
    }
}

def translate(lang, key, context=None):
    """Return translation from the translations dict for a given language."""
    if context is None:
        context = {}
    lang_translations = translations.get(lang)
    if not lang_translations:
        return f'invalid language: {lang}' % lang
    translation = lang_translations.get(key)
    if not translation:
        return f'missing translation: {lang}.{key}'
    return translation.format(**context)
