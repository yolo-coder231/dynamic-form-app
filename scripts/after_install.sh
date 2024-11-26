#!/bin/bash

# Install Nginx if not already installed
sudo apt update
sudo apt install -y nginx

# Remove default Nginx configuration
sudo rm -f /etc/nginx/sites-enabled/default

# Create Nginx configuration for the React app
echo "
server {
    listen 80;
    server_name _;
    root /home/ubuntu/server/build;

    index index.html;

    location / {
        try_files \$uri /index.html;
    }
}
" | sudo tee /etc/nginx/sites-available/react-app

# Enable the configuration
sudo ln -s /etc/nginx/sites-available/react-app /etc/nginx/sites-enabled/

# Restart Nginx
sudo service nginx restart
