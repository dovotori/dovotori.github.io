FROM node:16.13-alpine3.14 as client_base
LABEL maintainer="dovotori@proton.me"
WORKDIR /client

COPY package.json .
COPY package-lock.json .
RUN npm install
COPY ./webpack ./webpack
COPY ./public ./public
COPY ./src ./src
COPY .eslintrc .
COPY .babelrc .

FROM client_base as client_dev
EXPOSE 8080
ENTRYPOINT npm start

FROM client_base as client_prod
ENTRYPOINT npm run build
