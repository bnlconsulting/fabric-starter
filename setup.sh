#!/bin/bash

sudo apt-get update
sudo apt-get install -y libltdl3-dev python g++ build-essential unzip


# Install Docker

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
sudo usermod -aG docker $(whoami)

# Install docker compose

sudo curl -L https://github.com/docker/compose/releases/download/1.17.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


# Install nvm

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
nvm install --lts

#install Hyperledger Binaries
#curl -sSL https://goo.gl/byy2Qj | bash -s 1.0.5

# Install go

wget https://redirector.gvt1.com/edgedl/go/go1.9.2.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.9.2.linux-amd64.tar.gz
rm -rf go1.9.2.linux-amd64.tar.gz


cat << EOF >> ~/.profile
export PATH=$PATH:/usr/local/go/bin:/home/ubuntu/bin
export GOPATH=/opt/gopath
EOF

source ~/.profile
