# Build stage
FROM node:22-slim AS builder
WORKDIR /app
COPY . .
ARG BACKEND_URL
ENV VITE_BACKEND_URL=$BACKEND_URL
RUN npm ci && npm run build

# Nginx stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
