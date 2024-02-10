FROM node:18-alpine
WORKDIR /server
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 8086
CMD [ "node", "index.js" ]