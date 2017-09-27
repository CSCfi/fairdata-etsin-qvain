#!/bin/bash -xeu

# Run as the after_success step of a travis build.

git clone https://github.com/CSCfi/etsin-ops
cd etsin-ops/ansible/

if [[ "$TRAVIS_BRANCH" == "test" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Deploying to test.."
    ansible-galaxy -r requirements.yml install --roles-path=roles
    ansible-playbook -vv -i inventories/test/hosts site_deploy.yml --extra-vars "ssh_user=etsin-deploy-user"
elif [[ "$TRAVIS_BRANCH" == "stable" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Stable"
elif [[ "$TRAVIS_BRANCH" == "staging" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Staging"
elif [[ "$TRAVIS_BRANCH" == "production" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Production"
fi

