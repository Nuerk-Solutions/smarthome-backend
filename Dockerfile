FROM oven/bun:1 AS bun
FROM node:22 AS build
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY src ./src
RUN bun run build

FROM node:22 AS runtime
WORKDIR /app
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY scripts/convex-mirror.cjs ./scripts/convex-mirror.cjs
# Supply the complete runtime configuration using Docker --env-file .env.
CMD ["node", "dist/main.js"]
