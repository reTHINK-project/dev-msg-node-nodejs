#!/bin/bash
relPath=`dirname $0`
cd $relPath

docker-compose -p rethink up
