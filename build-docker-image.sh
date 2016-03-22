#!/bin/bash
relPath=`dirname $0`
cd $relPath

if [ $# -ne 4 ]
then
    echo "\nUsage:\n$0 {image-name} {msg-node url e.g. domain.tld} {e.g. 9090} {domain registry url e.g. http://registry.domain.tld}\n"
    exit 1
fi
IMAGE=$1
MSG_NODE_DOMAIN=$2
MSG_NODE_PORT=$3
DOMAIN_REGISTRY=$(echo "$4" | sed 's#/#\\/#g')

sed -i "s/url:.*$/url: '${MSG_NODE_DOMAIN}',/g" src/configs/server-settings.js
sed -i "s/domainRegistryUrl:.*$/domainRegistryUrl: '${DOMAIN_REGISTRY}',/g" src/configs/server-settings.js
sed -i "s/port:.*$/port: '${MSG_NODE_PORT}',/g" src/configs/server-settings.js

docker build -t $IMAGE .
