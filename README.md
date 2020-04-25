cordate
=======

User and admin client for Rosette REST API server

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Docker

Build a docker image with:

`docker build --no-cache -t leafcoders/cordate:1.0 .`

It will build the application in production mode and insert the application in a nginx docker image. The nginx configuration file is not provided but there are a template file. The template file has placeholders that should be replaced with real values, like `$ROSETTE_URL`, `$APPLICATION_NAME` and `$CORDATE_PATH`.

To use the image with `docker-compose` and with environemt variables to replace the placeholders, the following command can be specified:

`command: /bin/bash -c "envsubst '$$ROSETTE_URL $$APPLICATION_NAME $$CORDATE_PATH' < /etc/nginx/conf.d/cordate_conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"`