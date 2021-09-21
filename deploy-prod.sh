#!/bin/bash

if ! git diff-index --quiet HEAD --; then
    echo "Your working directory is not clean"
    exit 1
fi

if [[ $(git rev-parse --abbrev-ref HEAD) != "master" ]]; then
  echo "You are NOT on the master branch"
  exit 2
fi

echo "You are on the clean master branch, proceeding with deployment"



ssh ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com "mkdir -p /home/ubuntu/projects/crm-prod"
rsync -avz -e 'ssh' src ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' package.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' package-lock.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
# rsync -avz -e 'ssh' pm2.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' Dockerfile ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' docker-compose.yml ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu

# Build dockerfile
ssh ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com "cd /home/ubuntu/projects/crm-prod && docker build --no-cache -t crm/api-prod:latest ."
# Start the new container
ssh ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com "cd /home/ubuntu && docker-compose up -d"
# clean up loose containers, images
ssh ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com "docker system prune -f"
echo
echo "Production server is ready."
