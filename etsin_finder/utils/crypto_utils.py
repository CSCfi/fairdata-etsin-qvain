# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Symmetric encryption utils"""

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
import base64
import json


def generate_fernet_key(source_key):
    """Generate Fernet encryption key from e.g. Flask SECRET_KEY using HKDF.

    SECRET_KEY cannot be used directly because Fernet requires keys
    to be 32 url-safe base64-encoded bytes.
    """
    salt = b'\xc0\x11\xe5\xe6]"\xc5\xd5\xcf\x17\x19\xb6\x90\xe9\xa4\xaa'
    hkdf = HKDF(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        info=None,
    )
    if isinstance(source_key, str):
        source_bytes = source_key.encode("utf-8")
    else:
        source_bytes = source_key
    key = hkdf.derive(source_bytes)
    return base64.urlsafe_b64encode(key)


def dict_encrypt(payload, key):
    """Encode payload dictionary as json and encrypt it"""
    f = Fernet(key)
    payload_json = json.dumps(payload).encode("utf-8")
    return f.encrypt(payload_json).decode("utf-8")


def dict_decrypt(encoded_payload, key):
    """Decrypt payload and return it as dict"""
    f = Fernet(key)
    payload_bytes = encoded_payload.encode("utf-8")
    payload_json = f.decrypt(payload_bytes).decode("utf-8")
    return json.loads(payload_json)
