FROM node:12-alpine

RUN mkdir /app

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./

RUN npm set progress=false && npm ci && npm run build

CMD npm run start
