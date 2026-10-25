FROM node:26-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm,sharing=shared npm ci --no-audit --no-fund --prefer-offline
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM node:26-alpine AS runtime
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY scripts/serve-static.mjs ./serve-static.mjs
RUN chown -R appuser:appgroup /app
EXPOSE 3000
USER appuser
CMD ["node", "serve-static.mjs"]
