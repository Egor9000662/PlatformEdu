# Fetching the latest node image on alpine linux
FROM node:alpine AS development
# Declaring env
ENV NODE_ENV development
# Setting up the work directory
WORKDIR /react-app
# Installing dependencies
COPY ./package.json /react-app
RUN npm install
# Copying all the files in our project
COPY . .
# Starting our application
CMD ["npm", "run", "start:app"]

#FROM node:18-alpine
#WORKDIR /react-docker-example/
#COPY public/ /react-docker-example/public/
#COPY app/ /react-docker-example/src/
#COPY package.json /react-docker-example/
#RUN npm install
#CMD ["npm", "run", "start:app"]
