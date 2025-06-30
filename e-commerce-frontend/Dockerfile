# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Only copy necessary files for running the app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/src ./src
# Optionally copy .env if present
COPY .env .env
EXPOSE 3000
CMD ["npm", "start"] 