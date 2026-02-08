FROM oven/bun:latest

WORKDIR /app

WORKDIR /app/web
COPY web/package.json web/bun.lock* ./
RUN bun install --frozen-lockfile
COPY web/ ./
RUN bun run build

WORKDIR /app/backend
COPY backend/package.json backend/bun.lock* ./
RUN bun install --frozen-lockfile
COPY backend/ ./

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["bun", "index.ts"]