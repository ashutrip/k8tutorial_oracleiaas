FROM node:latest
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install app dependencies
COPY codesrc/package.json .
COPY codesrc/package-lock.json .
RUN npm install
# Bundle app source
COPY codesrc/. /usr/src/app
EXPOSE 8080
CMD [ "npm","start" ]

