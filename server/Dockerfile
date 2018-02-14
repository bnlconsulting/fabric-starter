
FROM bnlconsulting/fabric-rest:core

LABEL com.bnlconsulting.version="0.10"

# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN cd temp-dir && npm install && npm run-script build && npm cache rm

EXPOSE 4000

CMD [ "npm", "start" ]
