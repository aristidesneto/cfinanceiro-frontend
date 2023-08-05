FROM node:18.17.0-slim as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:stable-alpine3.17-slim

RUN mkdir /app

COPY --from=build /app/dist /app

COPY nginx/default.conf /etc/nginx/nginx.conf