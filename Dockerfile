FROM node:9-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

#EXPOSE 8080
ARG PORT=8080
ENV PORT $PORT
EXPOSE $PORT

CMD npm start