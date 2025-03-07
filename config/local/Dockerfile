FROM node:18.16.0-bullseye-slim AS deps
WORKDIR /usr/src/app
COPY src/main/package*.json ./src/main/
COPY apps/web/package*.json ./apps/web/
COPY package*.json ./
RUN npm install

FROM node:18.16.0-bullseye-slim AS runner
WORKDIR /usr/src/app
COPY --from=deps src/main/node_modules ./src/main/node_modules/
COPY --from=deps apps/web/node_modules ./apps/web/node_modules/
COPY --from=deps node_modules ./node_modules/
COPY src/main ./src/main/
COPY apps/web ./apps/web/

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["npm", "run", "next:dev"]
