FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build 

CMD ["node", "dist/index.js"]
