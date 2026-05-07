FROM node:18-alpine AS builder
 
WORKDIR /app
 
# Copy package files dulu (layer caching)
COPY package*.json ./
RUN npm ci
 
# Copy source code
COPY . .
 
# Build production bundle ke folder dist/
RUN npm run build
 
# ── Stage 2: Serve dengan Nginx ──────────────────────────
FROM nginx:alpine AS production
 
# Copy hasil build dari stage 1
COPY --from=builder /app/dist /usr/share/nginx/html
 
# Copy konfigurasi Nginx custom
COPY nginx.conf /etc/nginx/conf.d/default.conf
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]
