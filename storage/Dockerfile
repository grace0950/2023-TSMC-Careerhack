FROM node:19-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 8080

CMD ["npm", "run", "start"]