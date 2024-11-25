#!/bin/bash

# Change Working Directory
cd /home/ubuntu/server

# Delete Old PM2 Services
pm2 delete all

# Start Application using PM2
pm2 start "npm start"
