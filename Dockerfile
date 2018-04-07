# Customize the Angular app with environment arguments:
#
#   docker build --no-cache --build-arg rosetteUrl=https://api.mydomain.com/rosette -t leafcoders/cordate:1.0 .

# Stage 0, based on Node.js, to build and compile Angular
FROM node:8.6 as node
WORKDIR /app
COPY package.json /app/
RUN npm install
COPY ./ /app/
# ARG rosetteUrl=https://api.leafcoders.se/rosette
ARG env=prod
# RUN NG_ROSETTE_URL=$rosetteUrl npm run applyProdEnvs
RUN npm run build -- --prod --environment $env

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.13
COPY --from=node /app/dist/ /usr/share/nginx/html
COPY ./production/nginx.conf /etc/nginx/conf.d/cordate_conf.template