echo "
----------------------
  START SERVER
----------------------
"

sudo npm run build

sudo pm2 start ./src/server/bin/www

# modify the nginix config file

sudo rm /etc/nginx/sites-available/default

sudo nano /etc/nginx/sites-available/default

# start the nginix service 
sudo service nginx start