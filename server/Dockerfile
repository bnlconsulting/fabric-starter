
FROM bnlconsulting/fabric-rest:core

LABEL com.bnlconsulting.version="0.10"

# Create app directory
WORKDIR /usr/src/app
COPY . .

WORKDIR /usr/src/app/client-app
RUN npm install && npm run-script build

WORKDIR /usr/src/app
EXPOSE 4000

CMD [ "npm", "start" ]
