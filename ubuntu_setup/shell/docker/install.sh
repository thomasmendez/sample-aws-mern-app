#!/usr/bin/env bash

echo "
----------------------
  NODE & NPM
----------------------
"

# add nodejs 10 ppa (personal package archive) from nodesource
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

# install nodejs and npm
sudo apt-get install -y nodejs


echo "
----------------------
  MONGODB
----------------------
"

sudo apt remove mongodb-org

# import mongodb 4.0 public gpg key
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4

# create the /etc/apt/sources.list.d/mongodb-org-4.0.list file for mongodb
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list

# reload local package database
sudo apt-get update

# install the latest version of mongodb
sudo apt-get install -y mongodb-org

# forcefully remove these broken dependencies
sudo dpkg --remove --force-remove-reinstreq mongo-tools
sudo dpkg --remove --force-remove-reinstreq mongodb-server-core

# fix the broken install 
sudo apt-get --fix-broken -y install

# install mongodb 
sudo apt-get -y install mongodb

# start the service
sudo service mongodb start

# sudo apt-get -y install mongodb

# start mongodb
#sudo systemctl start mongod
# sudo service mongod start

# set mongodb to start automatically on system startup
#sudo systemctl enable mongod


echo "
----------------------
  PM2
----------------------
"

# install pm2 with npm
sudo npm install -g pm2

# set pm2 to start automatically on system startup
sudo pm2 startup systemd


echo "
----------------------
  NGINX
----------------------
"

# install nginx
sudo apt-get install -y nginx


echo "
----------------------
  UFW (FIREWALL)
----------------------
"

# docker container needs to install ufw
#sudo apt-get install ufw

# allow ssh connections through firewall
sudo ufw allow OpenSSH

# allow http & https through firewall
sudo ufw allow 'Nginx Full'

# enable firewall
sudo ufw --force enable

echo "
----------------------
  NPM INSTALL
----------------------
"

# install npm packages 

sudo npm install

echo "
----------------------
  ENV CONFIGURATION
----------------------
"

sudo cp .dev.env .env

echo "Created .env file from .dev.env"