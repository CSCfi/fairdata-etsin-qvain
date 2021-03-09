# etsin-finder

- This repository, etsin-finder, contains code for the Fairdata platforms Etsin and Qvain
- The development setup makes use of Docker

## 1. Development setup prerequisites

1. If not installed, install docker on your computer
    - `docker.com/get-started`
2. If not installed, install docker-compose
    - `docs.docker.com/compose/install`
3. Git clone this repository
4. Git clone the repository etsin-finder-search and place it in the same root folder as etsin-finder
5. Gain access to `fairdata-docker.artifactory.ci.csc.fi`, from where the custom Docker images are automatically pulled on setup

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
3. To setup the frontend, run:
    - `cd etsin_finder/frontend && docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm install`
    - This will navigate you to the frontend folder and build the `node_modules` folder inside the Docker container, even if npm is not installed on the host machine. This may take a few minutes.
4. Then, when the above command is done, run:
    - `docker run --rm -v $PWD:/etsin_finder/frontend -it etsin-qvain-webpack npm start`
    - This will build the `build` folder inside the Docker container, even if npm is not installed on the host machine
    - When the command is done, exit the process (`CTRL + C` or `CMD + C`), the build folder will be left in place
5. Initiate swarm
    - `cd ../..`
    - `docker swarm init`
6. Finally, run the app:
    - `cd ../`
    - ` docker stack deploy --with-registry-auth --resolve-image always --compose-file etsin-finder/docker-compose.yml --compose-file etsin-finder-search/docker-compose.yml etsin-qvain`
    - This will start the app etsin-finder, which should then be available at the DNS addresses specified above in step 2.1, with hot reload enabled, and all dependencies installed inside Docker containers
    - The backend (flask), rabbitmq-consumer and nginx will start first, followed by the frontend (webpack)

## 3. Exit development

How to exit development mode
    - `docker stack rm etsin-qvain`

# Build status

## Test branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=test)](https://travis-ci.com/CSCfi/etsin-finder)

## Stable branch
[![Build Status](https://travis-ci.com/CSCfi/etsin-finder.svg?branch=stable)](https://travis-ci.com/CSCfi/etsin-finder)

License
-------
Copyright (c) 2018-2020 Ministry of Education and Culture, Finland

Licensed under [MIT License](LICENSE)
