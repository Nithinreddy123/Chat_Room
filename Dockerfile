FROM node:10-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
FROM nginx:1.17.0-alpine
RUN apk add jq

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build .
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=builder /app/nginx/50x.html .
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]