# ==========================================
# Stage 1: Build the Vite React Application
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . ./

# Build arguments for Vite environment variables (provided at build time or CI)
ARG VITE_FIREBASE_API_KEY=""
ARG VITE_FIREBASE_AUTH_DOMAIN=""
ARG VITE_FIREBASE_DATABASE_URL=""
ARG VITE_FIREBASE_PROJECT_ID=""
ARG VITE_FIREBASE_STORAGE_BUCKET=""
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=""
ARG VITE_FIREBASE_APP_ID=""
ARG VITE_FIREBASE_MEASUREMENT_ID=""
ARG VITE_RAZORPAY_KEY_ID=""
ARG VITE_MAINTENANCE_MODE="false"

ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_DATABASE_URL=${VITE_FIREBASE_DATABASE_URL}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}
ENV VITE_RAZORPAY_KEY_ID=${VITE_RAZORPAY_KEY_ID}
ENV VITE_MAINTENANCE_MODE=${VITE_MAINTENANCE_MODE}

# Generate production bundle in /app/dist
RUN npm run build

# ==========================================
# Stage 2: Production Nginx Server (Cloud Run)
# ==========================================
FROM nginx:alpine

# Cloud Run defaults to port 8080
ENV PORT=8080

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built distribution from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx template (nginx:alpine automatically substitutes ${PORT} via envsubst)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
