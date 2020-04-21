FROM ubuntu:latest

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# tell the port number the container should expose
EXPOSE 5000

# run the command
CMD ["./ubuntu_setup/shell/install.sh"]
