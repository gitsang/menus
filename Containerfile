# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate images and build the app
RUN npm run generate && npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built static files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy static assets (images, menu.yaml)
COPY --from=builder /app/static /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]