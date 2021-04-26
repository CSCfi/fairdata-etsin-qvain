# etsin-finder

- This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain
- For a complete development setup of Etsin and Qvain, see repository `fairdata-secrets`

# Updating docker images

Two of the four Docker images are built (and can thus be edited) manually: webpack (frontend) and flask (backend)

First, login:
`docker login ci.fd-staging.csc.fi:5000`

Then, the service specific images can be pushed (see below)

## Updating etsin-qvain-webpack

When there are updates to npm packages, you will need to build, tag, and push the image again.

1 Build image:
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`

2 Tag image:
- `docker tag etsin-qvain-webpack ci.fd-staging.csc.fi:5000/fairdata-etsin-qvain-webpack`

3 Push image:
- `docker push ci.fd-staging.csc.fi:5000/fairdata-etsin-qvain-webpack`

## Updating etsin-qvain-flask

When there are updates to python packages, you will need to build, tag, and push the image again.

1 Build image:
- `docker build -f flask.dockerfile -t etsin-qvain-flask .`

2 Tag image:
- `docker tag etsin-qvain-flask ci.fd-staging.csc.fi:5000/fairdata-etsin-qvain-flask`

3 Push image:
- `docker push ci.fd-staging.csc.fi:5000/fairdata-etsin-qvain-flask`

## Running syntax checks

1 Running tox:
- `docker exec $(docker ps -q -f name=metax-etsin-qvain-dev_etsin-qvain-flask) tox`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)
