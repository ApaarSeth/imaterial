FROM node:latest as node
WORKDIR /app
COPY package.json /app
RUN npm install
RUN npm install -g @angular/cli@8.3.21
COPY . /app/
RUN npm run build 
# stage 2
FROM nginx:alpine
COPY --from=node /app/dist/imaterial /usr/share/nginx/html/
COPY --from=node /app/nginx.conf /etc/nginx/conf.d/default.conf