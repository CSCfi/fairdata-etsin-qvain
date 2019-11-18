#!/bin/bash -xeu

# Run after the tests are successfully completed in travis build.

if [[ "$TRAVIS_BRANCH" == "master" || "$TRAVIS_PULL_REQUEST" != "false" ]]; then
    exit 0
fi

pip install ansible==2.8.6
git clone https://github.com/CSCfi/etsin-ops
cd etsin-ops/ansible/

if [[ "$TRAVIS_BRANCH" == "test" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Deploying to test webservers.."
    ansible-galaxy -r requirements.yml install --roles-path=roles
    ansible-playbook -vv -i inventories/test/hosts deploy_webservers.yml --extra-vars "ssh_user=etsin-deploy-user"
elif [[ "$TRAVIS_BRANCH" == "stable" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    echo "Deploying to stable webservers.."
    ansible-galaxy -r requirements.yml install --roles-path=roles
    ansible-playbook -vv -i inventories/stable/hosts deploy_webservers.yml --extra-vars "ssh_user=etsin-deploy-user"
fi

# Make sure the last command to run before this part is the ansible-playbook command, whose return value is examined here
if [ $? -eq 0 ]
then
    exit 0
else
    exit 1
fi