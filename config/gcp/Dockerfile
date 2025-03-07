# Install dependencies only when needed
FROM node:18.16.0-bullseye-slim AS deps
WORKDIR /usr/src/app
COPY package*.json ./
COPY src/main/infrastructure/persistence/prisma/schema.prisma ./src/main/infrastructure/persistence/prisma/schema.prisma
RUN npm ci
RUN npm run db:generate

# Rebuild the source code only when needed
FROM node:18.16.0-bullseye-slim AS builder
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run next:build

# Production image, copy all the files and run next
FROM node:18.16.0-bullseye-slim AS runner
WORKDIR /usr/src/app

ENV NODE_ENV production

RUN addgroup --gid 1001 nodejs
RUN adduser --gid 1001 nextjs

COPY --from=builder /usr/src/app/next.config.js ./
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

ENV NEXT_TELEMETRY_DISABLED 1

# Environment is provided as a 3rd argument to this entrypoint by cloudbuild.yaml for staging & prod.
ENTRYPOINT ["node", "server.js"]
