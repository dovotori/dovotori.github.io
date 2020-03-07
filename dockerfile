FROM node:12.10.0-alpine as client_base
LABEL maintainer="dratovo@gmail.com"
WORKDIR /client

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY ./webpack ./webpack
COPY ./assets ./assets
COPY ./src ./src
COPY .eslintrc .
COPY .babelrc .

FROM client_base as client_dev
EXPOSE 8080
ENTRYPOINT npm start

FROM client_base as client_prod
ENTRYPOINT npm run build
