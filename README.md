# etsin-finder

- This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain
- The development setup makes use of Docker

## 1. Development setup prerequisites

1. If not installed, install docker on your computer
    - `docker.com/get-started`
2. If not installed, install docker-compose
    - `docs.docker.com/compose/install`

## 2. Development setup

1. First, Retrieve the etsin-qvain development secrets 
    - Gain access to relevant secret repository
    - Build the configs in root of that repository:
    
    Certificates:
    `docker config create fairdata-ssl-certificate tls/config/fd-dev.csc.fi.crt.pem`
    `docker config create fairdata-ssl-certificate-key tls/config/fd-dev.csc.fi.key.pem`
    `docker config create etsin-qvain-nginx-dhparam etsin/config/nginx/nginx_dhparam.pem`

    App_config:
    `docker config create etsin-qvain-app-config etsin/config/app_config`

    Nginx configurations:
    `docker config create etsin-qvain-nginx-config etsin/config/nginx/etsin-nginx.conf.dev`

2. Edit your local /etc/hosts file to include the following two lines:
    - `0.0.0.0        etsin.fd-dev.csc.fi`
    - `0.0.0.0        qvain.fd-dev.csc.fi`
3. Pull the two (2) custom Docker images from Artifactory (webpack, flask):
    - `docker pull fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-webpack`
    - `docker pull fairdata-docker.artifactory.ci.csc.fi/fairdata-etsin-qvain-flask` 
4. To setup the frontend, run:
    - `cd etsin_finder/frontend && docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm install`
    - This will navigate you to the frontend folder and build the `node_modules` folder inside the Docker container, even if npm is not installed on the host machine. This may take a few minutes.
5. Then, when the above command is done, run:
    - `docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm start`
    - This will build the `build` folder inside the Docker container, even if npm is not installed on the host machine
    - When the command is done, exit the process (`CTRL + C` or `CMD + C`), the build folder will be left in place
6. Create a network so that external calls are available using the Python script in etsin-finder-search (step 7, below)
    - `cd ../..`
    - `docker swarm init`
    - `docker network create -d overlay --attachable elastic-network`
7. Finally, run the app:
    - `docker stack deploy -c docker-compose.yml etsin-qvain`
    - This will start the app etsin-finder, which should then be available at the DNS addresses specified above in step 2.1, with hot reload enabled, and all dependencies installed inside Docker containers
    - The backend (flask) and nginx will start first, followed by the frontend (webpack)
8. Setup `etsin-finder-search` and load test datasets from Metax:
    - Open new terminal window, go to etsin-finder-search (`git clone` the repository if not done already)
    - `cd ../etsin-finder-search`
    - `docker build -f python.dockerfile  -t etsin-search-python ./`
    - `docker run --network=elastic-network etsin-search-python python load_test_data.py amount_of_datasets=199`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)
