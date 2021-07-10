FROM node:14-alpine

WORKDIR /app

COPY ./index.js /app/

EXPOSE 8080

CMD [ "node", "/app/index.js" ]