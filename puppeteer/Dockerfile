FROM ghcr.io/puppeteer/puppeteer:20.2.1

COPY package*.json ./

RUN npm ci

COPY . .

ENTRYPOINT ["node", "server.js"]