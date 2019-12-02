# Stage 0, based on Node.js, to build and compile Angular
FROM node:12.13.1-stretch-slim as node
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY ./ /app/
RUN npm run build -- --prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.16.1
COPY --from=node /app/dist/cordate /usr/share/nginx/html
COPY ./production/nginx.conf /etc/nginx/conf.d/cordate_conf.template
