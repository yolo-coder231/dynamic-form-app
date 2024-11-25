#!/bin/bash

# Change Working Directory
cd /home/ubuntu/server

# remove unused code
rm -rf node_modules
rm -rf build

#install node_modules & make react build
npm install
npm run build