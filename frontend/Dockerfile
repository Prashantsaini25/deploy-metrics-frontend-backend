# Stage 1: Build React app
FROM node:20 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV REACT_APP_API_URL backend-service.dashboard:8000/metrics

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
