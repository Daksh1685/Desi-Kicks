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

# Build arguments for Vite environment variables
ARG VITE_FIREBASE_API_KEY=AIzaSyCTSQUdV0M-kZKb5xK8_u33OIoGagg2D5w
ARG VITE_FIREBASE_AUTH_DOMAIN=lohithkumarshoemart.firebaseapp.com
ARG VITE_FIREBASE_DATABASE_URL=https://lohithkumarshoemart-default-rtdb.firebaseio.com
ARG VITE_FIREBASE_PROJECT_ID=lohithkumarshoemart
ARG VITE_FIREBASE_STORAGE_BUCKET=lohithkumarshoemart.firebasestorage.app
ARG VITE_FIREBASE_MESSAGING_SENDER_ID=924222607358
ARG VITE_FIREBASE_APP_ID=1:924222607358:web:0fe9bb5b9f807d3006faaf
ARG VITE_FIREBASE_MEASUREMENT_ID=G-M1NKNMJHC7

ENV VITE_FIREBASE_API_KEY=${VITE_FIREBASE_API_KEY}
ENV VITE_FIREBASE_AUTH_DOMAIN=${VITE_FIREBASE_AUTH_DOMAIN}
ENV VITE_FIREBASE_DATABASE_URL=${VITE_FIREBASE_DATABASE_URL}
ENV VITE_FIREBASE_PROJECT_ID=${VITE_FIREBASE_PROJECT_ID}
ENV VITE_FIREBASE_STORAGE_BUCKET=${VITE_FIREBASE_STORAGE_BUCKET}
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=${VITE_FIREBASE_MESSAGING_SENDER_ID}
ENV VITE_FIREBASE_APP_ID=${VITE_FIREBASE_APP_ID}
ENV VITE_FIREBASE_MEASUREMENT_ID=${VITE_FIREBASE_MEASUREMENT_ID}

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
