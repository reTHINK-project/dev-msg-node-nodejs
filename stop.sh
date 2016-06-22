#!/bin/bash
relPath=`dirname $0`
cd $relPath

docker-compose -p rethink kill
docker-compose -p rethink rm -f
