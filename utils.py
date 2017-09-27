import os

def executing_travis():
    """
    Returns True whenever code is being executed by travis
    """
    return True if os.getenv('TRAVIS', False) else False
