FROM node:22-alpine AS builder

WORKDIR /app

# added *.json since vite was throwing errors.
COPY ./package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build

# Run the nginx server to serve static files
FROM nginx:alpine

EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html


