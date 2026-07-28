# Stage 1: Builder
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY packages/types ./packages/types
COPY apps/server ./apps/server
RUN npm ci --workspace=apps/server --workspace=packages/types
RUN npm run build --workspace=apps/server

# Stage 2: Production
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/server/dist ./dist
COPY --from=builder /app/apps/server/package.json ./package.json
COPY --from=builder /app/apps/server/node_modules ./node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
