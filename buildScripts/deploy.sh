#!/bin/bash

set -x
pwd
COMMIT_ID=$(git rev-parse --short $GIT_COMMIT)
echo $COMMIT_ID-$BUILD_NUMBER

ls helm/imaterial-web/
#updating kubeconfig
#aws eks --region ap-south-1 update-kubeconfig --name prod-ecom-im-cluster
#deploy on kubernetes using helm
#helm upgrade commerce-report helm/commerce-report/ --set=deployment.image.tag=$COMMIT_ID-$BUILD_NUMBER -n prod