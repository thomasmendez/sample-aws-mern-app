# sample-aws-mern-app

## AWS Setup

### Create a new Ubuntu Server on AWS EC2

Before doing anything we need a server that we can work on, follow these steps to spin up a new Ubuntu 18.04 server instance on AWS EC2.

1. Sign into the AWS Management Console at [https://aws.amazon.com/console/](https://aws.amazon.com/console/). If you don't have an account yet click the "Create a Free Account" button and follow the prompts.

2. Go to the EC2 Service section.

3. Click the "Launch Instance" button.

4. Choose AMI - Check the "Free tier only" checkbox, enter "Ubuntu" in search box and press enter, then select the "Ubuntu Server 18.04" Amazon Machine Image (AMI).

5. Choose Instance Type - Select the "t2.micro" (Free tier eligible) instance type and click "Configure Security Group" in the top menu.

6. Configure Security Group - Add a new rule to allow HTTP traffic then click "Review and Launch".

7. Review - Click Launch

8. Select "Create a new key pair", enter a name for the key pair (e.g. "my-aws-key") and click "Download 

9. Key Pair" to download the private key, you will use this to connect to the server via SSH.

10. Click "Launch Instances", then scroll to the bottom of the page and click "View Instances" to see details of the new Ubuntu EC2 instance that is launching.

### Connect to Ubuntu EC2 Instance via SSH

Once the EC2 instance reaches a running state you can connect to it via SSH using the private key downloaded in the previous step.

1. Open a terminal window and update the permissions of the private key file with the command ```chmod 400 <path-to-key-file>``` e.g. ```chmod 400 ~/Downloads/my-aws-key.pem```, the key must not be publicly viewable for SSH to work.
2. Copy the "Public DNS (IPv4)" property from the instance description tab in the AWS Console, then connect to the instance from the terminal window with the command ```ssh -i <path-to-key-file> ubuntu@<domain name>``` e.g. ```ssh -i ~/Downloads/my-aws-key.pem ubuntu@ec2-52-221-185-40.ap-southeast-2.compute.amazonaws.com```
3. Enter yes to the prompt "Are you sure you want to continue connecting (yes/no)?" to add the url to your list of known hosts.

*NOTE: If you're using Windows you can connect to your instance via SSH using the PuTTY SSH client, for instructions see [Connect Using PuTTY](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html?icmpid=docs_ec2_console) in the AWS docs.*

### Setup Web Server with Node.js + MongoDB + NGINX

The below command executes a script to automatically setup and configure a production ready MERN Stack web server on Ubuntu that includes Node.js, MongoDB, PM2, NGINX and UFW.

While connected to the new AWS EC2 instance in the terminal window, run the following command:
```sudo bash /sample-aws-mern-app/ubuntu_setup/shellScripts/install.sh```

### Setup Environment Variables

Setup the correct environment variables in the .env file for this directory. Run this command to edit the prod.env file using the nano editor.
```
sudo nano .prod.env
```

#### Environment 

Setup the correct environment to run the applicaiton. The ENV variable can be set to 'development', 'staging', or 'production'. Since we are going to deploy our application live on the AWS EC2 Instance, we will set it to 'production' like so.
```
ENV='production'
```

#### API Access

In order to make sure that our application can obtain the correct information needed you will have to make sure that the following environment variables are set correctly. 

* HTTP - Can be 'http' or 'https' depending on how whether or not the application is already set to be secured or not. Recommended default for this example is 'http'.

* DOMAIN_NAME - Is the domain name of where users can access the app. In development it is set to 'localhost' but in production we will use the Public DNS (IPv4) address you obtain from the EC2 Instance. 

* PORTS (NODE_PORT/REACT_APP_PORT) - Modify the ```NODE_PORT``` and ```REACT_APP_PORT``` if needed (REACT_APP_PORT will not be used in production since the build will be used).

* NODE_API_URL - Set the api url that will be used to retrieve information from the node server. It can be practically anything, but for simplicity it is currently set to ```NODE_API_URL='/api'```.

* NODE_MONGODB_URI - Set the correct connection to access the MongoDB database if needed. The current default is ```'mongodb://localhost:27017/sample_aws_mern_users'```. 

#### Security

Change the ```NODE_SESSION_SECRET="YOUR SESSION SECRET"``` and ```NODE_COOKIE_SECRET="YOUR COOKIE SECRET"``` to something like ```NODE_SESSION_SECRET="574hh4@#198jrh18941!#$1"``` and ```NODE_COOKIE_SECRET="3271fh1he!^@!"``` (Please do not copy and paste these! Type your own random strings!) since these will be used to create a hash and secure a user's session and cookies so that their data cannot be easily exposed. Please maintain these in the .env file or in a much secure location and do not allow anyone to easily access these. 

#### Save 

Your final .env file should look something similar to this

```
# common
ENV='production'
HTTP_TYPE='http'
DOMAIN_NAME='ec2-3-19-246-200.us-east-2.compute.amazonaws.com/'

# node.js
NODE_PORT=3001

NODE_SESSION_SECRET="574hh4@#198jrh18941!#$1"
NODE_COOKIE_SECRET="fjafjoiewufovoajfasjdf"

NODE_API_URL='/api'

NODE_MONGODB_URI='mongodb://localhost:27017/sample_aws_mern_users'

# react.js 
REACT_APP_PORT=3000
```

To save in nano press control+X, press Y to save, and change the file name from .prod.env to .env

### Build React App & Start the Server

1. Build the react app. 

```
sudo npm run build
```

2. Start the node server using pm2

```
sudo pm2 start ./src/server/bin/www
```

### Configure NGINX to serve the Node.js API and React front-end

Configure NGINX to serve the React on the front-end and the Node.js API on the backend. Modify the default configuration by deleting the old configuration with ```sudo rm /etc/nginx/sites-available/default``` and creating a new one ```sudo nano /etc/nginx/sites-available/default```

Depending on the environment variables used in NODE_PORT and NODE_API_URL your configuration might be slighly different, but if we follow the defaults this is what the configuraiton would look like. 

```
server {
  listen 80 default_server;
  server_name _;

  # react app & front-end files
  location / {
    root /home/ubuntu/sample-aws-mern-app/dist;
    try_files $uri /index.html;
  }

  # node api reverse proxy
  location /api/ {
    proxy_pass http://localhost:3001/;
  }
}
```

Restart NGINX since we modified the default config file with ```sudo systemctl restart nginx``` to apply the changes. 

Quick breakdown of the NGINX configuration file:

* Server will be listening to port 80 (defualt port for EC2 Instance to allow users to access it)
* ```location /``` is the locaiton of the html files we will be using (it is going to be the final build)
* ```location /api/``` will be what NGINX will look for when fetch request are made and will send the request to our desired proxy server, which is where our node js server is running

### Test Application 

Access the Instance's Public DNS (IPv4) on your browser and check to make sure all the functionallty that works on a dev environment works in the produciton environment (it should). The application should also be fully funcitonal on mobile browsers (fetch apis don't work well for mobile in development environments for security reasons but work in production).

## Unit Testing

Unit testing is done with the javascript frameworks Mocha and Chai

1. In terminal where sample-aws-mern-app folder is located run

    ```
    npm test
    ```

## MERN Stack App Built With

Backend

* [Node.JS](http://www.dropwizard.io/1.0.2/docs/) - Back End Scripting Language
* [Express](https://expressjs.com/en/api.html) - Web Application Framework for Node.js
* [Passport](http://www.passportjs.org/) - Authentication Middleware for Node.js.

* [MongoDB](https://maven.apache.org/) - NoSQL Database
* [Mongoose](https://mongoosejs.com/docs/) - Object Data Modeling (ODM) library for MongoDB and Node.js

Frontend

* [React.js](https://reactjs.org/) - Javascript Library 
* [React Bootstrap](https://getbootstrap.com/docs/4.4/getting-started/introduction/) - Bootstrap (CSS Library/Framework) for React.js

Others

* [Babel](https://babeljs.io/docs/en/) - Javascript Compiler
* [Webpack](https://webpack.js.org/concepts/) - Static Module Bundler

Unit Testing

* [Mocha](https://mochajs.org/) - JavaScript Test Framework
* [Chai](https://www.chaijs.com/) -  BDD / TDD Assertion Library

## Authors

* **Thomas Antonio Mendez** - *Initial work* 

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/thomasmendez/lms-app/blob/master/LICENSE) file for details