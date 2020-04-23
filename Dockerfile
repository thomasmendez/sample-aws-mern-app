FROM ubuntu:latest

# set a directory for the app
WORKDIR /usr/src/app

# copy all the files to the container
COPY . .

# install dependencies
RUN apt-get update && DEBIAN_FRONTEND=noninteractive && \
      apt-get -y install sudo && \
      apt-get -y install apt-utils && \
      apt-get -y install systemd && \
      apt-get -y install curl && \
      apt-get -y install nano && \
      apt-get install iptables sudo -y && \
      apt-get -y install tzdata && \
      apt-get -y install mongodb && \
      apt-get -y install ssh && \
      apt-get -y install ufw  && \
      apt-get -y install iptables && \
      apt-get -y install lsof

# tell the port number the container should expose
EXPOSE 80

# run the command
#CMD ["/bin/sh"]
CMD ["./ubuntu_setup/shell/docker/install.sh", "/bin/sh"]