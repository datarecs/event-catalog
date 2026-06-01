FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN --mount=type=cache,id=npm,target=/root/.npm,sharing=shared npm install --legacy-peer-deps --prefer-offline
COPY . .
RUN npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
RUN --mount=type=cache,id=npm,target=/root/.npm,sharing=shared npm install -g serve --prefer-offline
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "dist", "-l", "3000", "-s"]
