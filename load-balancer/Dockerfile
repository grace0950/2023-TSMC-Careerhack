FROM node:19-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force
COPY . .
EXPOSE 8100

CMD ["npm", "run", "start"]