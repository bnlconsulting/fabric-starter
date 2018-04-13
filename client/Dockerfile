# base image
FROM node:8.11.1

# set working directory
WORKDIR /app
ADD . /app

# install and cache app dependencies
RUN npm install --silent
RUN npm install react-scripts@1.1.1 -g --silent

# expose 3000
EXPOSE 3000

# start app
CMD ["npm", "start"]