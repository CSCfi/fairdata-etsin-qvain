# etsin-finder

This repository contains code for the Fairdata platforms Etsin and Qvain. This repository has been developed using React, MobX, and Flask.

## Development setup

This repository functions as part of the Etsin-Qvain setup, together with `etsin-finder-search` (github.com/CSCfi/etsin-finder-search).

For a development setup of Etsin-Qvain using Docker, see repository https://gitlab.ci.csc.fi/fairdata/fairdata-docker

# Updating docker images

Two of the four Docker images are built (and can thus be edited) manually: webpack (frontend) and flask (backend)

First, login:
`docker login fairdata-docker.artifactory.ci.csc.fi`

Then, the service specific images can be pushed (see below)

## Updating etsin-qvain-webpack

When there are updates to npm packages, you will need to build, tag, and push the image again.

1 Build image:
- `docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend`

2 Tag image:
- `docker tag etsin-qvain-webpack fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

3 Push image:
- `docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`

## Updating etsin-qvain-flask

When there are updates to python packages, you will need to build, tag, and push the image again.

1 Build image:
- `docker build -f flask.dockerfile -t etsin-qvain-flask .`

2 Tag image:
- `docker tag etsin-qvain-flask fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-flask`

3 Push image:
- `docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-flask`

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
