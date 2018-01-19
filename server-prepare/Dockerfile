
FROM node:6-alpine

MAINTAINER bnlconsulting.com
LABEL com.bnlconsulting.version="0.2"
LABEL com.bnlconsulting.description="Fabric 1.0 rest api"

# Create app directory
WORKDIR /usr/src/app
COPY . .

# RUN apk --help
# install node-gyp dependancies (for alpine only)
RUN apk add --update python make alpine-sdk libc6-compat \
    && npm install && npm cache rm \
    # remove node-gyp dependancies (for alpine only)
    # libc6-compat is essential for grps, so don't remove it
    apk del --purge python make alpine-sdk
