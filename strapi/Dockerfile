# Install dependencies only when needed
FROM node:18.16.0-bullseye-slim AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:18.16.0-bullseye-slim AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
ENV NODE_ENV production
RUN npm run build

# Production image, copy all the files and run next
FROM node:18.16.0-bullseye-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

RUN addgroup --gid 1001 nodejs
RUN adduser --gid 1001 strapi

COPY --from=builder /usr/src/app ./

USER strapi

ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["node", "server.js"]
