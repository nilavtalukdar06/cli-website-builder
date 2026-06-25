FROM oven/bun:1.2.23-alpine AS base
WORKDIR /usr/src/app

FROM base AS dependencies

COPY package.json bun.lock ./

COPY apps/server/package.json ./apps/server/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY packages/ui/package.json ./packages/ui/

RUN bun install --frozen-lockfile

FROM base AS builder
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/apps/server/node_modules ./apps/server/node_modules

COPY package.json bun.lock ./
COPY apps/server ./apps/server

WORKDIR /usr/src/app/apps/server
RUN bun run postinstall

FROM base AS runner

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=dependencies /usr/src/app/apps/server/node_modules ./apps/server/node_modules
COPY --from=builder /usr/src/app/apps/server/generated ./apps/server/generated
COPY --from=builder /usr/src/app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /usr/src/app/apps/server/src ./apps/server/src
COPY --from=builder /usr/src/app/apps/server/prisma ./apps/server/prisma

WORKDIR /usr/src/app/apps/server
EXPOSE 5500
ENV PORT=5500
ENV NODE_ENV=production

CMD ["bun", "run", "start"]
