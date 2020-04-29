#!/bin/bash

set -xe
pwd
COMMIT_ID=$(git rev-parse --short $GIT_COMMIT)

if [ "$IMAGE_TAG" = "" ]
then
   TAG=$COMMIT_ID-$BUILD_NUMBER
else
   TAG=$IMAGE_TAG
fi
echo $TAG

ls helm/imaterial-web/
#updating kubeconfig
kubectl config use-context arn:aws:eks:ap-south-1:317596419736:cluster/dev-ecom-im-cluster
#deploy on kubernetes using helm
#helm upgrade imaterial-web helm/imaterial-web/ --set=deployment.image.tag=$TAG -n dev