#!/bin/bash

ssh ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com "mkdir -p /home/ubuntu/projects/crm-prod"
rsync -avz -e 'ssh' src ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' package.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' package-lock.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod
rsync -avz -e 'ssh' pm2.json ubuntu@ec2-35-178-187-243.eu-west-2.compute.amazonaws.com:/home/ubuntu/projects/crm-prod

