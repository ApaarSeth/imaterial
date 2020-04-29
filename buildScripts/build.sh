#!/bin/bash

set -xe
pwd
#loging into Ecr
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 317596419736.dkr.ecr.ap-south-1.amazonaws.com/imaterial/im-web
#created tag for docker images
COMMIT_ID=$(git rev-parse --short $GIT_COMMIT)

if [ "$IMAGE_TAG" = "" ]
then
   TAG=$COMMIT_ID-$BUILD_NUMBER
else
   TAG=$IMAGE_TAG
fi
echo $TAG

#creating docker image
docker build -t 317596419736.dkr.ecr.ap-south-1.amazonaws.com/imaterial/im-web:$TAG .
#pushing docker image to ecr
docker push 317596419736.dkr.ecr.ap-south-1.amazonaws.com/imaterial/im-web:$TAG
#removing docker image from system
docker rmi -f 317596419736.dkr.ecr.ap-south-1.amazonaws.com/imaterial/im-web:$TAG
#removing the intermediate build image
docker rmi -f $(docker images --filter "dangling=true" -q --no-trunc)
