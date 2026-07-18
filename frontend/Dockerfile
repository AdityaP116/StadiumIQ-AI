# Stage 1: Build the Vite application
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Environment variables for the frontend build should be passed here using --build-arg
# if they need to be baked into the static files. 
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects the container to listen on the port defined by the PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# Substitute the PORT variable in the nginx config at runtime and start nginx
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
