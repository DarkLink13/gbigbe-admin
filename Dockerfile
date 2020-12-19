FROM node:alpine

ENV HOST 0.0.0.0

ENV APP_ROOT /src

RUN apk --no-cache --update add python make g++

RUN mkdir ${APP_ROOT}

ADD . ${APP_ROOT}

WORKDIR ${APP_ROOT}

RUN npm ci

RUN npm run generate

EXPOSE 3000

CMD ["npm", "run", "start"]