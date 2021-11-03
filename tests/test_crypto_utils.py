# This file is part of the Etsin service
#
# Copyright 2017-2021 Ministry of Education and Culture, Finland
#
# :author: CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
# :license: MIT

"""Test crypto utils"""

from etsin_finder.utils.crypto_utils import (
    generate_fernet_key,
    dict_encrypt,
    dict_decrypt,
)
from cryptography.fernet import InvalidToken

import pytest


class TestCrypto:
    """Test crypto utils flags"""

    def test_generate_fernet_key(self):
        """Generate fernet key from secret key"""
        key = generate_fernet_key("topsecretbase64string")
        assert key == b"v5oprbW2tEdXAITv86NLMOyHS7ye6kuIVlHgXTs5fTQ="

    def test_generate_fernet_key_bytes_or_string(self):
        """Fail to decode message with wrong key"""
        key = generate_fernet_key("topsecretbase64string")
        same_key_from_bytes = generate_fernet_key(b"topsecretbase64string")
        assert key == same_key_from_bytes

    def test_encode_decode(self):
        """Encode and decode message"""
        key = generate_fernet_key("topsecretbase64string")
        payload = {"msg": "hello world", "email": "jeejee@example.com"}
        encrypted = dict_encrypt(payload, key)
        assert dict_decrypt(encrypted, key) == payload

    def test_encode_decode_wrong_key(self):
        """Fail to decode message with wrong key"""
        key = generate_fernet_key("topsecretbase64string")
        another_key = generate_fernet_key("someothersecret")
        payload = {"msg": "hello world", "email": "jeejee@example.com"}
        encrypted = dict_encrypt(payload, key)
        with pytest.raises(InvalidToken):
            dict_decrypt(encrypted, another_key)
