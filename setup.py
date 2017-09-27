from setuptools import setup

setup(
    name='etsin_finder',
    packages=['etsin_finder'],
    include_package_data=True,
    setup_requires=[
        'pytest-runner'
    ],
    tests_require=[
        'pytest'
    ]
)
