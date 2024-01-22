# fairdata-etsin-qvain

* This repository contains code for the Fairdata platforms Etsin and Qvain
* Developed using React, MobX, and Flask

## Docker development setup

* This repository functions as part of the Etsin-Qvain setup, together with `fairdata-etsin-search` (github.com/CSCfi/etsin-finder-search).
* For a development setup of Etsin-Qvain using Docker, see repository https://gitlab.ci.csc.fi/fairdata/fairdata-docker

### Run tox syntax checks in Docker

```bash
docker exec $(docker ps -q -f name=metax-etsin-qvain-dev_etsin-qvain-flask) tox
```

### Update Docker images to Artifactory

* When there are updates to e.g. npm packages, you should build, tag, and push the `fairdata-etsin-qvain-webpack` image
* When there are updates to python packages, you will need to build, tag, and push the `fairdata-etsin-qvain-flask` image

```bash
# Login
docker login fairdata-docker.artifactory.ci.csc.fi

# Update images
docker build -f etsin_finder/frontend/webpack.dockerfile -t etsin-qvain-webpack etsin_finder/frontend
docker build -f flask.dockerfile -t etsin-qvain-flask .

# Tag images
docker tag etsin-qvain-webpack fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack
docker tag etsin-qvain-flask fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-flask

# Push images
docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack
docker push fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-flask
```

## Poetry: python dependency management

* Python dependencies are managed with Poetry. 
* https://python-poetry.org/docs/

Installation:

```bash
# Installing Poetry requirement pipx
https://github.com/pypa/pipx

# Then, install Poetry
pipx install poetry
```

Usage:

```bash
# Install dependencies
poetry install

# Add dependencies
poetry add <dependency>

# Update dependencies according to pyproject.toml
poetry update
poetry export --without-hashes -o requirements.txt

# Add new development dependencies using -D option
poetry add -D tox

# After poetry commands, update requirements.txt
poetry export --without-hashes -o requirements.txt

# After poetry commands, update dev dependencies with dev dependencies with 
poetry export --without-hashes --dev -o requirements.txt
```


License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)
