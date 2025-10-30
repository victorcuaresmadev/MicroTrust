# Multi-stage Dockerfile for Angular production build served by Nginx

# --- Build stage ---
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# Copy source
COPY . .

# Build Angular app (production by default per angular.json)
RUN npm run build

# --- Runtime stage ---
FROM nginx:alpine AS runtime

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled app
COPY --from=build /app/dist/microcreditos /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]


